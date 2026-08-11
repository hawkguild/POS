import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Product,
  CannabisLot,
  KratomBatch,
  Supplier,
  Customer,
  SaleOrder,
  StockMovement,
  KitchenOrder,
  AuditLog,
  ShopSettings,
  User,
  Expense,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SHOP_SETTINGS,
  INITIAL_SUPPLIERS,
  INITIAL_CANNABIS_LOTS,
  INITIAL_KRATOM_BATCHES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_EXPENSES,
} from '../data/initialData';

// Collection Names map matching user schema requirement
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export const COLLECTIONS = {
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  DEPARTMENTS: 'departments',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRODUCT_VARIANTS: 'product_variants',
  PRODUCT_BATCHES: 'product_batches',
  PRODUCT_LOTS: 'product_lots',
  INGREDIENTS: 'ingredients',
  RECIPES: 'recipes',
  RECIPE_ITEMS: 'recipe_items',
  PURCHASES: 'purchases',
  PURCHASE_ITEMS: 'purchase_items',
  SALES: 'sales',
  SALE_ITEMS: 'sale_items',
  PAYMENTS: 'payments',
  STOCK: 'stock',
  STOCK_MOVEMENTS: 'stock_movements',
  KITCHEN_ORDERS: 'kitchen_orders',
  KITCHEN_ORDER_ITEMS: 'kitchen_order_items',
  DISCOUNTS: 'discounts',
  PROMOTIONS: 'promotions',
  EXPENSES: 'expenses',
  DOCUMENTS: 'documents',
  ATTACHMENTS: 'attachments',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'settings',
  CANNABIS_PRODUCTS: 'cannabis_products',
  CANNABIS_LOTS: 'cannabis_lots',
  CANNABIS_DOCUMENTS: 'cannabis_documents',
  CANNABIS_MOVEMENTS: 'cannabis_movements',
  PRESCRIPTIONS: 'prescriptions',
};

/**
 * Seed Firestore with initial demonstration data if collection is empty
 */
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const productsSnap = await getDocs(query(collection(db, COLLECTIONS.PRODUCTS), limit(1)));
    if (!productsSnap.empty) {
      console.log('Firestore already initialized with data.');
      return false;
    }

    console.log('Seeding initial Firestore database structure...');

    // Seed Users
    for (const user of INITIAL_USERS) {
      await setDoc(doc(db, COLLECTIONS.USERS, user.id), sanitizeForFirestore(user));
    }

    // Seed Settings
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'default'), sanitizeForFirestore(INITIAL_SHOP_SETTINGS));

    // Seed Suppliers
    for (const supplier of INITIAL_SUPPLIERS) {
      await setDoc(doc(db, COLLECTIONS.SUPPLIERS, supplier.id), sanitizeForFirestore(supplier));
    }

    // Seed Customers
    for (const customer of INITIAL_CUSTOMERS) {
      await setDoc(doc(db, COLLECTIONS.CUSTOMERS, customer.id), sanitizeForFirestore(customer));
    }

    // Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), sanitizeForFirestore(prod));
    }

    // Seed Cannabis Lots
    for (const lot of INITIAL_CANNABIS_LOTS) {
      await setDoc(doc(db, COLLECTIONS.CANNABIS_LOTS, lot.id), sanitizeForFirestore(lot));
    }

    // Seed Kratom Batches
    for (const batch of INITIAL_KRATOM_BATCHES) {
      await setDoc(doc(db, COLLECTIONS.PRODUCT_BATCHES, batch.id), sanitizeForFirestore(batch));
    }

    // Seed Expenses & Incomes
    for (const exp of INITIAL_EXPENSES) {
      await setDoc(doc(db, COLLECTIONS.EXPENSES, exp.id), sanitizeForFirestore(exp));
    }

    // Seed default categories
    const categories = [
      { id: 'cat-cannabis', name: 'กัญชาทางการแพทย์ (Medical Cannabis)', type: 'cannabis' },
      { id: 'cat-kratom', name: 'กระท่อม/เครื่องดื่มต้ม (Kratom Drinks)', type: 'kratom' },
      { id: 'cat-food', name: 'อาหารเเละเครื่องดื่ม (Food & Kitchen)', type: 'food' },
      { id: 'cat-general', name: 'สินค้าทั่วไป (General Products)', type: 'general' },
    ];
    for (const cat of categories) {
      await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
    }

    // Seed default roles & permissions
    await setDoc(doc(db, COLLECTIONS.ROLES, 'role-admin'), {
      name: 'เจ้าของร้าน / ผู้จัดการ (Admin)',
      description: 'เข้าถึงได้ทุกระบบในร้าน',
      permissionIds: ['all'],
    });
    await setDoc(doc(db, COLLECTIONS.ROLES, 'role-pharmacist'), {
      name: 'เภสัชกร / แพทย์แผนไทย',
      description: 'ตรวจอายุ ประวัติผู้ป่วย เเละจ่ายกัญชาทางการแพทย์',
      permissionIds: ['cannabis_dispense', 'patient_records'],
    });

    // Seed sample cannabis document
    await setDoc(doc(db, COLLECTIONS.CANNABIS_DOCUMENTS, 'doc-001'), {
      title: 'ใบอนุญาตจำหน่ายสมุนไพรควบคุม (กัญชา)',
      docType: 'License',
      issueDate: '2025-01-01',
      expiryDate: '2026-12-31',
      fileUrl: '#',
    });

    // Seed sample prescription
    await setDoc(doc(db, COLLECTIONS.PRESCRIPTIONS, 'rx-001'), {
      prescriptionNo: 'RX-2026-0089',
      patientName: 'คุณสมชาย เข็มทอง',
      doctorName: 'พท.ป. ณัฐวุฒิ สุขสวัสดิ์',
      licenseNo: 'พท.ป. 4812',
      diagnosis: 'อาการนอนไม่หลับเรื้อรังเเละปวดกล้ามเนื้อ',
      issueDate: '2026-08-01',
    });

    console.log('Firestore initial database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding Firestore data:', error);
    return false;
  }
}

// Helper to remove undefined properties which cause Firestore setDoc errors
function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// Helpers to sync specific entities to Firestore
export async function saveSaleToFirestore(saleOrder: SaleOrder) {
  try {
    await setDoc(doc(db, COLLECTIONS.SALES, saleOrder.id), sanitizeForFirestore(saleOrder));
    // Also save individual sale items
    for (const item of saleOrder.items) {
      await setDoc(doc(db, COLLECTIONS.SALE_ITEMS, `${saleOrder.id}_${item.id}`), sanitizeForFirestore({
        saleId: saleOrder.id,
        ...item,
      }));
    }
  } catch (err) {
    console.error('Failed to save sale to Firestore:', err);
  }
}

export async function saveAuditLogToFirestore(log: AuditLog) {
  try {
    await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, log.id), sanitizeForFirestore(log));
  } catch (err) {
    console.error('Failed to save audit log to Firestore:', err);
  }
}

export async function saveStockMovementToFirestore(movement: StockMovement) {
  try {
    await setDoc(doc(db, COLLECTIONS.STOCK_MOVEMENTS, movement.id), sanitizeForFirestore(movement));
  } catch (err) {
    console.error('Failed to save stock movement to Firestore:', err);
  }
}

export async function saveProductToFirestore(product: Product) {
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), sanitizeForFirestore(product));
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
  }
}

export async function saveCustomerToFirestore(customer: Customer) {
  try {
    await setDoc(doc(db, COLLECTIONS.CUSTOMERS, customer.id), sanitizeForFirestore(customer));
  } catch (err) {
    console.error('Failed to save customer to Firestore:', err);
  }
}

export async function saveSupplierToFirestore(supplier: Supplier) {
  try {
    await setDoc(doc(db, COLLECTIONS.SUPPLIERS, supplier.id), sanitizeForFirestore(supplier));
  } catch (err) {
    console.error('Failed to save supplier to Firestore:', err);
  }
}

export async function saveCannabisLotToFirestore(lot: CannabisLot) {
  try {
    await setDoc(doc(db, COLLECTIONS.CANNABIS_LOTS, lot.id), sanitizeForFirestore(lot));
  } catch (err) {
    console.error('Failed to save cannabis lot to Firestore:', err);
  }
}

export async function saveKratomBatchToFirestore(batch: KratomBatch) {
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCT_BATCHES, batch.id), sanitizeForFirestore(batch));
  } catch (err) {
    console.error('Failed to save kratom batch to Firestore:', err);
  }
}

export async function saveKitchenOrderToFirestore(order: KitchenOrder) {
  try {
    await setDoc(doc(db, COLLECTIONS.KITCHEN_ORDERS, order.id), sanitizeForFirestore(order));
  } catch (err) {
    console.error('Failed to save kitchen order to Firestore:', err);
  }
}

export async function saveShopSettingsToFirestore(settings: ShopSettings) {
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'default'), sanitizeForFirestore(settings));
  } catch (err) {
    console.error('Failed to save shop settings to Firestore:', err);
  }
}

export async function saveUserToFirestore(user: User) {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), sanitizeForFirestore(user));
  } catch (err) {
    console.error('Failed to save user to Firestore:', err);
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
  }
}

export async function deleteUserFromFirestore(userId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
  } catch (err) {
    console.error('Failed to delete user from Firestore:', err);
  }
}

export async function deleteSupplierFromFirestore(supplierId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SUPPLIERS, supplierId));
  } catch (err) {
    console.error('Failed to delete supplier from Firestore:', err);
  }
}

export async function deleteCustomerFromFirestore(customerId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId));
  } catch (err) {
    console.error('Failed to delete customer from Firestore:', err);
  }
}

export async function saveExpenseToFirestore(expense: Expense) {
  try {
    await setDoc(doc(db, COLLECTIONS.EXPENSES, expense.id), sanitizeForFirestore(expense));
  } catch (err) {
    console.error('Failed to save expense to Firestore:', err);
  }
}

export async function deleteExpenseFromFirestore(expenseId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EXPENSES, expenseId));
  } catch (err) {
    console.error('Failed to delete expense from Firestore:', err);
  }
}

export async function resetAllSalesInFirestore(saleOrders: SaleOrder[]) {
  try {
    for (const order of saleOrders) {
      await deleteDoc(doc(db, COLLECTIONS.SALES, order.id));
      if (order.items) {
        for (const item of order.items) {
          await deleteDoc(doc(db, COLLECTIONS.SALE_ITEMS, `${order.id}_${item.id}`));
        }
      }
    }
  } catch (err) {
    console.error('Failed to delete sales from Firestore:', err);
  }
}

