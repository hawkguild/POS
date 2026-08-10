/**
 * THAI MULTI BUSINESS POS - Data Types
 * Cannabis (🌿) + Kratom (🥤) + Food (🍜) + General (📦)
 */

export type BusinessCategory = 'cannabis' | 'kratom' | 'food' | 'general';

export type UserRole = 'super_admin' | 'manager' | 'cashier' | 'warehouse' | 'kitchen';

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  role: UserRole;
  pin: string;
  avatar?: string;
}

export interface Supplier {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  taxId: string;
  address: string;
  productTypes: BusinessCategory[];
  licenseNumber?: string; // e.g. ใบอนุญาตจำหน่าย/ปลูกกัญชา
  licenseExpiry?: string;
  status: 'active' | 'inactive';
}

export interface CannabisLot {
  id: string;
  lotNumber: string; // e.g. LOT-2026-001
  productId: string;
  strain: string; // สายพันธุ์ e.g. KD Koh Tao
  type: 'flower' | 'pre_roll' | 'extract' | 'accessories';
  thcPercent: number;
  cbdPercent: number;
  coaNumber: string; // Certificate of Analysis e.g. COA-TH-2026-881
  supplierId: string;
  supplierName: string;
  originLocation: string; // e.g. ฟาร์มกัญชาออร์แกนิค เชียงใหม่
  initialWeightGrams: number;
  remainingWeightGrams: number;
  receivedDate: string;
  expiryDate: string;
  status: 'available' | 'low' | 'depleted' | 'quarantined';
  notes?: string;
}

export interface KratomRecipeItem {
  ingredientId: string;
  ingredientName: string;
  quantityNeeded: number;
  unit: 'g' | 'kg' | 'ml' | 'L' | 'pcs';
}

export interface KratomBatch {
  id: string;
  batchNo: string; // e.g. KT-20260810-001
  productName: string;
  producedVolumeLiters: number;
  yieldBottles: number;
  bottleSizeMl: number;
  leafWeightGrams: number; // น้ำหนักใบกระท่อมที่ใช้ (g)
  leafOrigin?: string; // แหล่งที่มา/แหล่งปลูก e.g. สุราษฎร์ธานี
  processingDate?: string; // วันที่แปรรูป/ต้มสกัด
  processingWeightKg?: number; // น้ำหนักใบนวัตกรรมแปรรูป (kg)
  supplierName?: string; // ผู้จัดส่งวัตถุดิบ/ฟาร์ม
  notes?: string; // หมายเหตุการแปรรูป
  totalCostThb: number;
  costPerLiterThb: number;
  costPerBottleThb: number;
  productionDate: string;
  status: 'active' | 'sold_out' | 'expired';
  recipe: KratomRecipeItem[];
  fdaCompliantLabel: boolean;
}

export interface FoodRecipeItem {
  ingredientId: string;
  ingredientName: string;
  quantityNeeded: number;
  unit: 'g' | 'kg' | 'ml' | 'L' | 'pcs';
  costPerUnit: number;
}

export interface Product {
  id: string;
  code: string; // SKU / Barcode
  name: string;
  category: BusinessCategory;
  subcategory: string; // e.g. 'Flower', 'Cold Drinks', 'Curry', 'Accessories'
  price: number;
  cost: number;
  stockUnit: 'g' | 'bottle' | 'dish' | 'pcs' | 'pack';
  stockQuantity: number;
  minStockAlert: number;
  image?: string;
  description?: string;
  status: 'available' | 'out_of_stock' | 'disabled';
  
  // Cannabis Specific
  cannabisDetails?: {
    strain: string;
    thcPercent: number;
    cbdPercent: number;
    activeLotId?: string;
    coaNumber?: string;
    controlledHerbLicenseRequired: boolean;
  };

  // Kratom Specific
  kratomDetails?: {
    activeBatchNo?: string;
    volumeMl?: number;
    recipe?: KratomRecipeItem[];
    fdaWarningLabel: string;
  };

  // Food Specific
  foodDetails?: {
    kitchenStation: 'kitchen' | 'bar' | 'prep';
    recipe?: FoodRecipeItem[];
    allowCustomNotes: boolean;
  };
}

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  productName: string;
  category: BusinessCategory;
  price: number;
  cost: number;
  quantity: number; // e.g. grams or dishes or bottles
  unit: string;
  discount: number; // THB
  subtotal: number;
  lotNumber?: string; // Selected Cannabis Lot
  batchNo?: string; // Selected Kratom Batch
  customNotes?: string; // e.g. "ไม่เผ็ด", "แยกน้ำแข็ง"
}

export type PaymentMethod = 'cash' | 'promptpay' | 'transfer' | 'card' | 'split';

export interface PaymentBreakdown {
  method: PaymentMethod;
  amount: number;
  referenceNo?: string;
  change?: number;
}

export interface SaleOrder {
  id: string;
  orderNo: string; // e.g. ORD-20260810-0012
  timestamp: string;
  cashierId: string;
  cashierName: string;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  taxAmount: number;
  netTotal: number;
  paymentMethods: PaymentBreakdown[];
  paymentStatus: 'paid' | 'refunded' | 'partially_refunded';
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableNo?: string;
  
  // Customer & Patient Info
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  patientMedicalNote?: string; // For cannabis compliance reference
  prescriptionRef?: string; // ใบสั่งจ่ายสมุนไพรควบคุม
  
  // Kitchen status
  kitchenStatus: 'pending' | 'preparing' | 'ready' | 'served' | 'none';
}

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  category: BusinessCategory;
  lotNumber?: string;
  batchNo?: string;
  type: 'in' | 'sale' | 'adjustment' | 'damage' | 'return';
  quantityChange: number; // positive or negative
  balanceAfter: number;
  unit: string;
  reason: string;
  userId: string;
  userName: string;
}

export interface Customer {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  birthDate?: string; // Age verification (20+)
  points: number;
  totalSpend: number;
  medicalHistoryNote?: string;
  registeredDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g. 'MANUAL_STOCK_ADJUSTMENT', 'PRICE_OVERRIDE', 'DELETE_ORDER'
  module: 'pos' | 'cannabis' | 'kratom' | 'inventory' | 'kitchen' | 'settings';
  details: string;
  oldValue?: string;
  newValue?: string;
  mandatoryReason?: string;
}

export interface KitchenOrder {
  id: string;
  orderNo: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableNo?: string;
  timestamp: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    station: 'kitchen' | 'bar' | 'prep';
    customNotes?: string;
    status: 'pending' | 'preparing' | 'ready' | 'served';
  }[];
  overallStatus: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface ShopSettings {
  shopName: string;
  taxId: string;
  promptPayId?: string;
  promptPayName?: string;
  address: string;
  phone: string;
  cannabisLicenseNo: string;
  kratomFdaNo: string;
  foodLicenseNo: string;
  vatPercent: number; // e.g. 7%
  ageLimitCannabisGrams: number;
  receiptHeader: string;
  receiptFooter: string;
  autoPrintReceipt: boolean;
  ageVerificationRequired: boolean;
  requireMedicalRefForCannabis: boolean;
}
