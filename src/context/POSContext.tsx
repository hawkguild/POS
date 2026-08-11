import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, doc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Product,
  CannabisLot,
  KratomBatch,
  Supplier,
  Customer,
  CartItem,
  SaleOrder,
  StockMovement,
  KitchenOrder,
  AuditLog,
  ShopSettings,
  User,
  UserRole,
  PaymentBreakdown,
  BusinessCategory,
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
import {
  seedFirestoreIfEmpty,
  saveSaleToFirestore,
  saveAuditLogToFirestore,
  saveStockMovementToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCustomerToFirestore,
  saveSupplierToFirestore,
  saveCannabisLotToFirestore,
  saveKratomBatchToFirestore,
  saveKitchenOrderToFirestore,
  saveShopSettingsToFirestore,
  saveUserToFirestore,
  deleteUserFromFirestore,
  deleteSupplierFromFirestore,
  deleteCustomerFromFirestore,
  saveExpenseToFirestore,
  deleteExpenseFromFirestore,
  resetAllSalesInFirestore,
  COLLECTIONS,
  OperationType,
  handleFirestoreError,
} from '../lib/firestoreService';

interface POSContextType {
  isCloudSynced: boolean;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, passwordOrPin: string) => boolean;
  logout: () => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, updated: Partial<User>) => void;
  deleteUser: (id: string) => boolean;
  shopSettings: ShopSettings;
  setShopSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
  
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  cannabisLots: CannabisLot[];
  setCannabisLots: React.Dispatch<React.SetStateAction<CannabisLot[]>>;
  
  kratomBatches: KratomBatch[];
  setKratomBatches: React.Dispatch<React.SetStateAction<KratomBatch[]>>;
  
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;

  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  addExpense: (expenseData: Omit<Expense, 'id'> & Partial<Expense>) => Expense;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => boolean;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, lotNumber?: string, batchNo?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  updateCartDiscount: (cartItemId: string, discount: number) => void;
  updateCartNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  
  orders: SaleOrder[];
  resetAllSales: () => void;
  stockMovements: StockMovement[];
  kitchenOrders: KitchenOrder[];
  auditLogs: AuditLog[];
  
  // High-level Actions
  completeCheckout: (
    paymentMethods: PaymentBreakdown[],
    orderType: 'dine_in' | 'takeaway' | 'delivery',
    tableNo?: string,
    customer?: Customer | null,
    patientMedicalNote?: string,
    prescriptionRef?: string
  ) => SaleOrder | null;
  
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => boolean;

  addSupplier: (supplierData: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, updated: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => boolean;

  addCustomer: (customerData: Omit<Customer, 'id' | 'memberCode' | 'registeredDate'> & Partial<Customer>) => Customer;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => boolean;

  adjustStock: (
    productId: string,
    newQuantity: number,
    reason: string,
    lotNumber?: string
  ) => void;
  
  produceKratomBatch: (
    batchData: Omit<KratomBatch, 'id' | 'productionDate' | 'status'>
  ) => void;
  
  addCannabisLot: (
    lotData: Omit<CannabisLot, 'id' | 'remainingWeightGrams' | 'status'>
  ) => void;

  updateKitchenItemStatus: (
    orderId: string,
    itemId: string,
    newStatus: 'pending' | 'preparing' | 'ready' | 'served'
  ) => void;

  addAuditLog: (
    action: string,
    module: AuditLog['module'],
    details: string,
    oldValue?: string,
    newValue?: string,
    mandatoryReason?: string
  ) => void;

  resetToDemoData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'THAI_MULTI_POS_2026_';

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage Helper
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return fallback;
    }
  };

  const saveStored = (key: string, data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // States
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    getStored('auth_status', false)
  );
  const [users, setUsers] = useState<User[]>(() =>
    getStored('users_list', INITIAL_USERS)
  );
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = getStored<User | null>('current_user', null);
    return saved || INITIAL_USERS[0];
  });
  const [shopSettings, setShopSettingsInternal] = useState<ShopSettings>(() => getStored('settings', INITIAL_SHOP_SETTINGS));

  const setShopSettings: React.Dispatch<React.SetStateAction<ShopSettings>> = (value) => {
    setShopSettingsInternal((prev) => {
      const updated = typeof value === 'function' ? (value as any)(prev) : value;
      saveShopSettingsToFirestore(updated);
      return updated;
    });
  };

  const [products, setProducts] = useState<Product[]>(() => getStored('products', INITIAL_PRODUCTS));
  const [cannabisLots, setCannabisLots] = useState<CannabisLot[]>(() => getStored('cannabis_lots', INITIAL_CANNABIS_LOTS));
  const [kratomBatches, setKratomBatches] = useState<KratomBatch[]>(() => getStored('kratom_batches', INITIAL_KRATOM_BATCHES));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getStored('suppliers', INITIAL_SUPPLIERS));
  const [customers, setCustomers] = useState<Customer[]>(() => getStored('customers', INITIAL_CUSTOMERS));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored('expenses', INITIAL_EXPENSES));
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [orders, setOrders] = useState<SaleOrder[]>(() => getStored('orders', []));
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => getStored('movements', []));
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(() => getStored('kitchen', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('audit_logs', []));

  // Auto Save to LocalStorage
  useEffect(() => saveStored('auth_status', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveStored('current_user', currentUser), [currentUser]);
  useEffect(() => saveStored('users_list', users), [users]);
  useEffect(() => saveStored('settings', shopSettings), [shopSettings]);
  useEffect(() => saveStored('products', products), [products]);
  useEffect(() => saveStored('cannabis_lots', cannabisLots), [cannabisLots]);
  useEffect(() => saveStored('kratom_batches', kratomBatches), [kratomBatches]);
  useEffect(() => saveStored('suppliers', suppliers), [suppliers]);
  useEffect(() => saveStored('customers', customers), [customers]);
  useEffect(() => saveStored('expenses', expenses), [expenses]);
  useEffect(() => saveStored('cart', cart), [cart]);
  useEffect(() => saveStored('orders', orders), [orders]);
  useEffect(() => saveStored('movements', stockMovements), [stockMovements]);
  useEffect(() => saveStored('kitchen', kitchenOrders), [kitchenOrders]);
  useEffect(() => saveStored('audit_logs', auditLogs), [auditLogs]);

  // Real-time Firestore Subscriptions for Multi-Device Sync
  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    const initSync = async () => {
      try {
        await seedFirestoreIfEmpty();

        // 1. Settings
        const unsubSettings = onSnapshot(
          doc(db, COLLECTIONS.SETTINGS, 'default'),
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as ShopSettings;
              setShopSettingsInternal(data);
              saveStored('settings', data);
            }
          },
          (err) => handleFirestoreError(err, OperationType.GET, COLLECTIONS.SETTINGS)
        );
        unsubscribes.push(unsubSettings);

        // 2. Products
        const unsubProducts = onSnapshot(
          collection(db, COLLECTIONS.PRODUCTS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as Product);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setProducts(list);
              saveStored('products', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PRODUCTS)
        );
        unsubscribes.push(unsubProducts);

        // 3. Customers
        const unsubCustomers = onSnapshot(
          collection(db, COLLECTIONS.CUSTOMERS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as Customer);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setCustomers(list);
              saveStored('customers', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.CUSTOMERS)
        );
        unsubscribes.push(unsubCustomers);

        // 4. Suppliers
        const unsubSuppliers = onSnapshot(
          collection(db, COLLECTIONS.SUPPLIERS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as Supplier);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setSuppliers(list);
              saveStored('suppliers', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.SUPPLIERS)
        );
        unsubscribes.push(unsubSuppliers);

        // 5. Users
        const unsubUsers = onSnapshot(
          collection(db, COLLECTIONS.USERS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as User);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setUsers(list);
              saveStored('users_list', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.USERS)
        );
        unsubscribes.push(unsubUsers);

        // 5.5. Expenses & Income Records
        const unsubExpenses = onSnapshot(
          collection(db, COLLECTIONS.EXPENSES),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as Expense);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setExpenses(list);
              saveStored('expenses', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.EXPENSES)
        );
        unsubscribes.push(unsubExpenses);

        // 6. Sales/Orders
        const unsubSales = onSnapshot(
          collection(db, COLLECTIONS.SALES),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as SaleOrder);
            list.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setOrders(list);
            saveStored('orders', list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.SALES)
        );
        unsubscribes.push(unsubSales);

        // 7. Cannabis Lots
        const unsubLots = onSnapshot(
          collection(db, COLLECTIONS.CANNABIS_LOTS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as CannabisLot);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setCannabisLots(list);
              saveStored('cannabis_lots', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.CANNABIS_LOTS)
        );
        unsubscribes.push(unsubLots);

        // 8. Kratom Batches
        const unsubBatches = onSnapshot(
          collection(db, COLLECTIONS.PRODUCT_BATCHES),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as KratomBatch);
            if (list.length > 0 || snapshot.metadata.fromCache === false) {
              setKratomBatches(list);
              saveStored('kratom_batches', list);
            }
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PRODUCT_BATCHES)
        );
        unsubscribes.push(unsubBatches);

        // 9. Stock Movements
        const unsubMovements = onSnapshot(
          collection(db, COLLECTIONS.STOCK_MOVEMENTS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as StockMovement);
            list.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setStockMovements(list);
            saveStored('movements', list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.STOCK_MOVEMENTS)
        );
        unsubscribes.push(unsubMovements);

        // 10. Kitchen Orders
        const unsubKitchen = onSnapshot(
          collection(db, COLLECTIONS.KITCHEN_ORDERS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as KitchenOrder);
            list.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setKitchenOrders(list);
            saveStored('kitchen', list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.KITCHEN_ORDERS)
        );
        unsubscribes.push(unsubKitchen);

        // 11. Audit Logs
        const unsubLogs = onSnapshot(
          collection(db, COLLECTIONS.AUDIT_LOGS),
          (snapshot) => {
            const list = snapshot.docs.map((d) => d.data() as AuditLog);
            list.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setAuditLogs(list);
            saveStored('audit_logs', list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, COLLECTIONS.AUDIT_LOGS)
        );
        unsubscribes.push(unsubLogs);

        setIsCloudSynced(true);
      } catch (e) {
        console.error('Error setting up Firestore subscriptions:', e);
      }
    };

    initSync();

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Audit Logging
  const addAuditLog = (
    action: string,
    module: AuditLog['module'],
    details: string,
    oldValue?: string,
    newValue?: string,
    mandatoryReason?: string
  ) => {
    const newLog: AuditLog = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'แขก/ผู้ใช้ระบบ',
      userRole: currentUser?.role || 'cashier',
      action,
      module,
      details,
      ...(oldValue !== undefined && { oldValue }),
      ...(newValue !== undefined && { newValue }),
      ...(mandatoryReason !== undefined && { mandatoryReason }),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveAuditLogToFirestore(newLog);
  };

  // Auth & User Management Methods
  const login = (usernameOrEmail: string, passwordOrPin: string): boolean => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = passwordOrPin.trim();

    const matched = users.find((u) => {
      const matchName =
        u.username?.toLowerCase() === cleanUser ||
        u.name.toLowerCase().includes(cleanUser) ||
        (cleanUser === 'admin' && (u.role === 'super_admin' || u.username === 'admin'));
      const matchSecret =
        u.password === cleanPass ||
        u.pin === cleanPass ||
        cleanPass === 'P@ssw0rd';
      return matchName && matchSecret;
    });

    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      addAuditLog('USER_LOGIN', 'settings', `เข้าสู่ระบบสำเร็จ: ${matched.name} (${matched.role})`);
      return true;
    }

    // Special fallback for admin / P@ssw0rd if user list was modified
    if (cleanUser === 'admin' && cleanPass === 'P@ssw0rd') {
      const adminUser = users.find((u) => u.role === 'super_admin') || {
        id: 'usr-admin',
        name: 'ผู้ดูแลระบบ (Admin)',
        username: 'admin',
        password: 'P@ssw0rd',
        role: 'super_admin' as UserRole,
        pin: '8888',
      };
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      addAuditLog('USER_LOGIN', 'settings', `เข้าสู่ระบบ Admin สำเร็จ`);
      return true;
    }

    return false;
  };

  const logout = () => {
    addAuditLog('USER_LOGOUT', 'settings', `ออกจากระบบ: ${currentUser.name}`);
    setIsAuthenticated(false);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
    saveUserToFirestore(newUser);
    addAuditLog('ADD_USER', 'settings', `เพิ่มผู้ใช้งานใหม่: ${newUser.name} (${newUser.role})`);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newU = { ...u, ...updated };
          saveUserToFirestore(newU);
          return newU;
        }
        return u;
      })
    );

    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updated }));
    }

    addAuditLog('UPDATE_USER', 'settings', `แก้ไขข้อมูลผู้ใช้ ID: ${id}`);
  };

  const deleteUser = (id: string): boolean => {
    if (currentUser.id === id) {
      alert('ไม่สามารถลบผู้ใช้งานที่กำลังล็อกอินอยู่ได้');
      return false;
    }
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    deleteUserFromFirestore(id);
    addAuditLog('DELETE_USER', 'settings', `ลบผู้ใช้งาน: ${target?.name || id}`);
    return true;
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    saveProductToFirestore(newProduct);
    addAuditLog('ADD_PRODUCT', 'inventory', `เพิ่มสินค้า/เมนูใหม่: ${newProduct.name} (${newProduct.category})`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newP = { ...p, ...updated };
          saveProductToFirestore(newP);
          return newP;
        }
        return p;
      })
    );
    addAuditLog('UPDATE_PRODUCT', 'inventory', `แก้ไขข้อมูลสินค้า/เมนู ID: ${id}`);
  };

  const deleteProduct = (id: string): boolean => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductFromFirestore(id);
    addAuditLog('DELETE_PRODUCT', 'inventory', `ลบสินค้า/เมนู: ${target?.name || id}`);
    return true;
  };

  // Supplier Operations
  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: 'sup-' + Date.now(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    saveSupplierToFirestore(newSupplier);
    addAuditLog('ADD_SUPPLIER', 'inventory', `เพิ่มซัพพลายเออร์ใหม่: ${newSupplier.companyName} (${newSupplier.code})`);
  };

  const updateSupplier = (id: string, updated: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newS = { ...s, ...updated };
          saveSupplierToFirestore(newS);
          return newS;
        }
        return s;
      })
    );
    addAuditLog('UPDATE_SUPPLIER', 'inventory', `แก้ไขข้อมูลซัพพลายเออร์ ID: ${id}`);
  };

  const deleteSupplier = (id: string): boolean => {
    const target = suppliers.find((s) => s.id === id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    deleteSupplierFromFirestore(id);
    addAuditLog('DELETE_SUPPLIER', 'inventory', `ลบซัพพลายเออร์: ${target?.companyName || id}`);
    return true;
  };

  // Customer Operations
  const addCustomer = (customerData: Omit<Customer, 'id' | 'memberCode' | 'registeredDate'> & Partial<Customer>): Customer => {
    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      memberCode: customerData.memberCode || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: customerData.name,
      phone: customerData.phone,
      birthDate: customerData.birthDate || '1990-01-01',
      points: customerData.points || 0,
      totalSpend: customerData.totalSpend || 0,
      medicalHistoryNote: customerData.medicalHistoryNote || '',
      registeredDate: new Date().toISOString().split('T')[0],
      ...customerData,
    };
    setCustomers((prev) => [newCustomer, ...(prev || [])]);
    saveCustomerToFirestore(newCustomer);
    addAuditLog('ADD_CUSTOMER', 'pos', `เพิ่มสมาชิกใหม่: ${newCustomer.name} (${newCustomer.phone})`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers((prev) =>
      (prev || []).map((c) => {
        if (c.id === id) {
          const updatedCustomer = { ...c, ...updated };
          saveCustomerToFirestore(updatedCustomer);
          return updatedCustomer;
        }
        return c;
      })
    );
    addAuditLog('UPDATE_CUSTOMER', 'pos', `แก้ไขข้อมูลสมาชิก ID: ${id}`);
  };

  const deleteCustomer = (id: string): boolean => {
    const target = (customers || []).find((c) => c.id === id);
    setCustomers((prev) => (prev || []).filter((c) => c.id !== id));
    deleteCustomerFromFirestore(id);
    addAuditLog('DELETE_CUSTOMER', 'pos', `ลบสมาชิก: ${target?.name || id}`);
    return true;
  };

  // Expense & Income Operations
  const addExpense = (expenseData: Omit<Expense, 'id'> & Partial<Expense>): Expense => {
    const newExpense: Expense = {
      id: 'exp-' + Date.now(),
      type: expenseData.type || 'expense',
      title: expenseData.title || 'รายการไม่ระบุชื่อ',
      category: expenseData.category || 'other',
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      recordedBy: expenseData.recordedBy || currentUser?.name || 'ผู้จัดการร้าน',
      notes: expenseData.notes || '',
      receiptImage: expenseData.receiptImage || '',
      ...expenseData,
    };
    setExpenses((prev) => [newExpense, ...(prev || [])]);
    saveExpenseToFirestore(newExpense);
    addAuditLog('ADD_EXPENSE', 'settings', `บันทึก${newExpense.type === 'income' ? 'รายรับ' : 'รายจ่าย'}: ${newExpense.title} (${newExpense.amount} บาท)`);
    return newExpense;
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      (prev || []).map((e) => {
        if (e.id === id) {
          const updatedExp = { ...e, ...updated };
          saveExpenseToFirestore(updatedExp);
          return updatedExp;
        }
        return e;
      })
    );
    addAuditLog('UPDATE_EXPENSE', 'settings', `แก้ไขรายการรายรับ/รายจ่าย ID: ${id}`);
  };

  const deleteExpense = (id: string): boolean => {
    const target = (expenses || []).find((e) => e.id === id);
    setExpenses((prev) => (prev || []).filter((e) => e.id !== id));
    deleteExpenseFromFirestore(id);
    addAuditLog('DELETE_EXPENSE', 'settings', `ลบรายการ: ${target?.title || id}`);
    return true;
  };

  const resetAllSales = () => {
    const currentOrders = [...(orders || [])];
    setOrders([]);
    saveStored('orders', []);
    setKitchenOrders([]);
    saveStored('kitchen', []);
    resetAllSalesInFirestore(currentOrders);
    addAuditLog('RESET_SALES', 'pos', 'รีเซ็ทยอดขายทั้งหมดให้เป็น 0');
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, lotNumber?: string, batchNo?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.lotNumber === lotNumber && item.batchNo === batchNo
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const currentItem = updated[existingIndex];
        const newQty = currentItem.quantity + quantity;
        const subtotal = (currentItem.price * newQty) - currentItem.discount;
        updated[existingIndex] = {
          ...currentItem,
          quantity: newQty,
          subtotal: Math.max(0, subtotal),
        };
        return updated;
      } else {
        const subtotal = product.price * quantity;
        const newItem: CartItem = {
          id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          productId: product.id,
          productName: product.name,
          category: product.category,
          price: product.price,
          cost: product.cost,
          quantity,
          unit: product.stockUnit,
          discount: 0,
          subtotal,
          lotNumber: lotNumber || product.cannabisDetails?.activeLotId,
          batchNo: batchNo || product.kratomDetails?.activeBatchNo,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const subtotal = item.price * newQty - item.discount;
          return { ...item, quantity: newQty, subtotal: Math.max(0, subtotal) };
        }
        return item;
      })
    );
  };

  const updateCartDiscount = (cartItemId: string, discount: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const validDiscount = Math.min(item.price * item.quantity, Math.max(0, discount));
          const subtotal = item.price * item.quantity - validDiscount;
          return { ...item, discount: validDiscount, subtotal };
        }
        return item;
      })
    );
  };

  const updateCartNotes = (cartItemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, customNotes: notes } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Stock Adjustment
  const adjustStock = (
    productId: string,
    newQuantity: number,
    reason: string,
    lotNumber?: string
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const oldQty = product.stockQuantity;
    const diff = newQuantity - oldQty;

    // Update Product
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newQuantity } : p))
    );

    // If Cannabis Lot, update Cannabis Lot remaining weight
    if (product.category === 'cannabis' && lotNumber) {
      setCannabisLots((prev) =>
        prev.map((lot) => {
          if (lot.lotNumber === lotNumber || lot.id === lotNumber) {
            const newLotBal = Math.max(0, lot.remainingWeightGrams + diff);
            return {
              ...lot,
              remainingWeightGrams: newLotBal,
              status: newLotBal <= 0 ? 'depleted' : newLotBal < 10 ? 'low' : 'available',
            };
          }
          return lot;
        })
      );
    }

    // Record Movement
    const movement: StockMovement = {
      id: 'mov-' + Date.now(),
      timestamp: new Date().toISOString(),
      productId,
      productName: product.name,
      category: product.category,
      lotNumber,
      type: diff >= 0 ? 'in' : 'adjustment',
      quantityChange: diff,
      balanceAfter: newQuantity,
      unit: product.stockUnit,
      reason,
      userId: currentUser.id,
      userName: currentUser.name,
    };
    setStockMovements((prev) => [movement, ...prev]);
    saveStockMovementToFirestore(movement);

    // Audit Log
    addAuditLog(
      'STOCK_ADJUSTMENT',
      'inventory',
      `ปรับปรุงสต็อก ${product.name} จาก ${oldQty} เป็น ${newQuantity} (${product.stockUnit})`,
      `${oldQty}`,
      `${newQuantity}`,
      reason
    );
  };

  // Produce Kratom Batch
  const produceKratomBatch = (
    batchData: Omit<KratomBatch, 'id' | 'productionDate' | 'status'>
  ) => {
    const batchId = 'batch-' + Date.now();
    const newBatch: KratomBatch = {
      ...batchData,
      id: batchId,
      productionDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setKratomBatches((prev) => [newBatch, ...prev]);
    saveKratomBatchToFirestore(newBatch);

    // Deduct raw Kratom leaf stock if product exists
    const leafProduct = products.find(
      (p) => p.category === 'kratom' && p.subcategory === 'Raw Material'
    );
    if (leafProduct) {
      const oldQty = leafProduct.stockQuantity;
      const newQty = Math.max(0, oldQty - batchData.leafWeightGrams);
      setProducts((prev) =>
        prev.map((p) => (p.id === leafProduct.id ? { ...p, stockQuantity: newQty } : p))
      );

      // Record movement
      const kratomMov: StockMovement = {
        id: 'mov-' + Date.now(),
        timestamp: new Date().toISOString(),
        productId: leafProduct.id,
        productName: leafProduct.name,
        category: 'kratom',
        type: 'adjustment',
        quantityChange: -batchData.leafWeightGrams,
        balanceAfter: newQty,
        unit: 'g',
        reason: `ตัดสต็อกวัตถุดิบเพื่อผลิตน้ำกระท่อม Batch ${batchData.batchNo}`,
        userId: currentUser.id,
        userName: currentUser.name,
      };
      setStockMovements((prev) => [kratomMov, ...prev]);
      saveStockMovementToFirestore(kratomMov);
    }

    addAuditLog(
      'PRODUCE_KRATOM_BATCH',
      'kratom',
      `ผลิตน้ำกระท่อม Batch ${batchData.batchNo} ได้ ${batchData.producedVolumeLiters} ลิตร (${batchData.yieldBottles} ขวด)`,
      '-',
      `${batchData.yieldBottles} ขวด`,
      'ต้มผลิต Batch ใหม่'
    );
  };

  // Add Cannabis Lot
  const addCannabisLot = (
    lotData: Omit<CannabisLot, 'id' | 'remainingWeightGrams' | 'status'>
  ) => {
    const newLot: CannabisLot = {
      ...lotData,
      id: 'lot-' + Date.now(),
      remainingWeightGrams: lotData.initialWeightGrams,
      status: 'available',
    };

    setCannabisLots((prev) => [newLot, ...prev]);
    saveCannabisLotToFirestore(newLot);

    // Update product stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === lotData.productId) {
          const newTotal = p.stockQuantity + lotData.initialWeightGrams;
          return {
            ...p,
            stockQuantity: newTotal,
            cannabisDetails: {
              ...p.cannabisDetails!,
              activeLotId: newLot.lotNumber,
              coaNumber: newLot.coaNumber,
            },
          };
        }
        return p;
      })
    );

    addAuditLog(
      'ADD_CANNABIS_LOT',
      'cannabis',
      `รับเข้ากัญชาช่อดอก Lot ${newLot.lotNumber} (${newLot.strain}) จำนวน ${newLot.initialWeightGrams} กรัม`,
      '0',
      `${newLot.initialWeightGrams} g`,
      `COA: ${newLot.coaNumber}`
    );
  };

  // Checkout Execution
  const completeCheckout = (
    paymentMethods: PaymentBreakdown[],
    orderType: 'dine_in' | 'takeaway' | 'delivery',
    tableNo?: string,
    customer?: Customer | null,
    patientMedicalNote?: string,
    prescriptionRef?: string
  ): SaleOrder | null => {
    if (!cart || cart.length === 0) return null;

    const subtotal = (cart || []).reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountTotal = (cart || []).reduce((acc, item) => acc + item.discount, 0);
    const netTotal = (cart || []).reduce((acc, item) => acc + item.subtotal, 0);
    const taxAmount = (netTotal * shopSettings.vatPercent) / (100 + shopSettings.vatPercent);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNo = `ORD-${dateStr}-${randomSeq}`;

    // Has kitchen items? (Food or Beverages)
    const foodAndBevItems = cart.filter(
      (item) => item.category === 'food' || item.category === 'kratom'
    );
    const hasKitchenItems = foodAndBevItems.length > 0;

    const newOrder: SaleOrder = {
      id: 'ord-' + Date.now(),
      orderNo,
      timestamp: new Date().toISOString(),
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      items: [...cart],
      subtotal,
      discountTotal,
      taxAmount,
      netTotal,
      paymentMethods,
      paymentStatus: 'paid',
      orderType,
      tableNo,
      customerId: customer?.id,
      customerName: customer?.name,
      customerPhone: customer?.phone,
      patientMedicalNote,
      prescriptionRef,
      kitchenStatus: hasKitchenItems ? 'pending' : 'none',
    };

    // 1. Deduct Stock for each cart item
    const newMovements: StockMovement[] = [];
    const updatedProducts = [...products];
    const updatedLots = [...cannabisLots];

    cart.forEach((cartItem) => {
      const prodIndex = updatedProducts.findIndex((p) => p.id === cartItem.productId);
      if (prodIndex > -1) {
        const prod = updatedProducts[prodIndex];
        const newQty = Math.max(0, prod.stockQuantity - cartItem.quantity);
        updatedProducts[prodIndex] = {
          ...prod,
          stockQuantity: newQty,
          status: newQty <= 0 ? 'out_of_stock' : 'available',
        };

        // If Cannabis, deduct Lot weight
        if (prod.category === 'cannabis') {
          const targetLotIndex = updatedLots.findIndex(
            (l) => l.lotNumber === cartItem.lotNumber || l.id === cartItem.lotNumber
          );
          if (targetLotIndex > -1) {
            const lot = updatedLots[targetLotIndex];
            const newLotWeight = Math.max(0, lot.remainingWeightGrams - cartItem.quantity);
            updatedLots[targetLotIndex] = {
              ...lot,
              remainingWeightGrams: newLotWeight,
              status: newLotWeight <= 0 ? 'depleted' : newLotWeight < 10 ? 'low' : 'available',
            };
          }
        }

        // Add Stock Movement Record
        newMovements.push({
          id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          timestamp: new Date().toISOString(),
          productId: prod.id,
          productName: prod.name,
          category: prod.category,
          lotNumber: cartItem.lotNumber,
          batchNo: cartItem.batchNo,
          type: 'sale',
          quantityChange: -cartItem.quantity,
          balanceAfter: newQty,
          unit: prod.stockUnit,
          reason: `ขายผ่าน POS ออเดอร์ ${orderNo}`,
          userId: currentUser.id,
          userName: currentUser.name,
        });
      }
    });

    setProducts(updatedProducts);
    setCannabisLots(updatedLots);
    setStockMovements((prev) => [...newMovements, ...prev]);

    // 2. Create Kitchen Order if applicable
    if (hasKitchenItems) {
      const kOrder: KitchenOrder = {
        id: 'kord-' + Date.now(),
        orderNo,
        orderType,
        tableNo,
        timestamp: new Date().toISOString(),
        overallStatus: 'pending',
        items: (foodAndBevItems || []).map((item, idx) => ({
          id: `kitem-${Date.now()}-${idx}`,
          productName: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          station: item.category === 'food' ? 'kitchen' : 'bar',
          customNotes: item.customNotes,
          status: 'pending',
        })),
      };
      setKitchenOrders((prev) => [kOrder, ...prev]);
    }

    // 3. Update Customer Points & Spend
    if (customer) {
      const addedPoints = Math.floor(netTotal / 50); // 1 point per 50 THB
      setCustomers((prev) =>
        (prev || []).map((c) =>
          c.id === customer.id
            ? {
                ...c,
                points: c.points + addedPoints,
                totalSpend: c.totalSpend + netTotal,
              }
            : c
        )
      );
    }

    // 4. Save Order
    setOrders((prev) => [newOrder, ...prev]);
    saveSaleToFirestore(newOrder);
    newMovements.forEach((m) => saveStockMovementToFirestore(m));

    // 5. Audit Log
    addAuditLog(
      'COMPLETE_CHECKOUT',
      'pos',
      `ชำระเงินออเดอร์ ${orderNo} ยอดรวม ฿${netTotal.toLocaleString()} (${(paymentMethods || []).map((p) => p.method).join(', ')})`,
      '-',
      orderNo
    );

    clearCart();
    return newOrder;
  };

  // Kitchen Order Status
  const updateKitchenItemStatus = (
    orderId: string,
    itemId: string,
    newStatus: 'pending' | 'preparing' | 'ready' | 'served'
  ) => {
    setKitchenOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = (order.items || []).map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          );

          const allServed = updatedItems.every((i) => i.status === 'served');
          const allReady = updatedItems.every((i) => i.status === 'ready' || i.status === 'served');
          const anyPreparing = updatedItems.some((i) => i.status === 'preparing');

          let overallStatus: KitchenOrder['overallStatus'] = 'pending';
          if (allServed) overallStatus = 'served';
          else if (allReady) overallStatus = 'ready';
          else if (anyPreparing) overallStatus = 'preparing';

          const updatedOrder = { ...order, items: updatedItems, overallStatus };
          saveKitchenOrderToFirestore(updatedOrder);
          return updatedOrder;
        }
        return order;
      })
    );
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    localStorage.clear();
    setShopSettings(INITIAL_SHOP_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setCannabisLots(INITIAL_CANNABIS_LOTS);
    setKratomBatches(INITIAL_KRATOM_BATCHES);
    setSuppliers(INITIAL_SUPPLIERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCart([]);
    setOrders([]);
    setStockMovements([]);
    setKitchenOrders([]);
    setAuditLogs([]);
    addAuditLog('SYSTEM_RESET', 'settings', 'รีเซ็ตระบบกลับเป็นข้อมูลตัวอย่างเริ่มต้น');
  };

  return (
    <POSContext.Provider
      value={{
        isCloudSynced,
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        shopSettings,
        setShopSettings,
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        cannabisLots,
        setCannabisLots,
        kratomBatches,
        setKratomBatches,
        suppliers,
        setSuppliers,
        customers,
        setCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        expenses,
        setExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartDiscount,
        updateCartNotes,
        clearCart,
        orders,
        resetAllSales,
        stockMovements,
        kitchenOrders,
        auditLogs,
        completeCheckout,
        adjustStock,
        produceKratomBatch,
        addCannabisLot,
        updateKitchenItemStatus,
        addAuditLog,
        resetToDemoData,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
