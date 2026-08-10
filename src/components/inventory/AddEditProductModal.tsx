import React, { useState, useEffect } from 'react';
import { Product, BusinessCategory } from '../../types';
import { usePOS } from '../../context/POSContext';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Plus,
  Sparkles,
  Utensils,
  Coffee,
  Leaf,
  Package,
  Trash2,
} from 'lucide-react';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

// Preset images for easy selection
const PRESET_IMAGES = [
  {
    name: 'ผัดไทย / อาหารผัด',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'ก๋วยเตี๋ยว / ต้มยำ',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'ข้าวผัด / ข้าวหน้า',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'ส้มตำ / ยำ spicy',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'กาแฟเย็น / ชาเย็น',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'น้ำกระท่อมบรรจุขวด',
    category: 'kratom',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'ชาสมุนไพร / กระท่อมสด',
    category: 'kratom',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'กัญชา ช่อดอกเกรดพรีเมียม',
    category: 'cannabis',
    url: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'กัญชา โรลสำเร็จรูป (Pre-roll)',
    category: 'cannabis',
    url: 'https://images.unsplash.com/photo-1568658176307-bfbd2873abda?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'สินค้าทั่วไป / อุปกรณ์',
    category: 'general',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
  },
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct } = usePOS();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('food');
  const [subcategory, setSubcategory] = useState('อาหารจานเดียว');
  const [price, setPrice] = useState<number>(80);
  const [cost, setCost] = useState<number>(35);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [stockUnit, setStockUnit] = useState<'dish' | 'bottle' | 'g' | 'pcs' | 'pack'>('dish');
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'available' | 'out_of_stock' | 'disabled'>('available');

  // Category specific
  const [kitchenStation, setKitchenStation] = useState<'kitchen' | 'bar' | 'prep'>('kitchen');
  const [strain, setStrain] = useState('');
  const [thcPercent, setThcPercent] = useState<number>(18);
  const [cbdPercent, setCbdPercent] = useState<number>(1);
  const [volumeMl, setVolumeMl] = useState<number>(500);

  // Tab for image input
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');

  // Load editing product or default
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCode(productToEdit.code);
      setCategory(productToEdit.category);
      setSubcategory(productToEdit.subcategory || '');
      setPrice(productToEdit.price);
      setCost(productToEdit.cost);
      setStockQuantity(productToEdit.stockQuantity);
      setStockUnit(productToEdit.stockUnit);
      setMinStockAlert(productToEdit.minStockAlert);
      setImage(productToEdit.image || '');
      setDescription(productToEdit.description || '');
      setStatus(productToEdit.status);

      if (productToEdit.foodDetails) {
        setKitchenStation(productToEdit.foodDetails.kitchenStation || 'kitchen');
      }
      if (productToEdit.cannabisDetails) {
        setStrain(productToEdit.cannabisDetails.strain || '');
        setThcPercent(productToEdit.cannabisDetails.thcPercent || 0);
        setCbdPercent(productToEdit.cannabisDetails.cbdPercent || 0);
      }
      if (productToEdit.kratomDetails) {
        setVolumeMl(productToEdit.kratomDetails.volumeMl || 500);
      }
    } else {
      // Reset form
      const genCode = 'MENU-' + Math.floor(1000 + Math.random() * 9000);
      setName('');
      setCode(genCode);
      setCategory('food');
      setSubcategory('อาหารจานเดียว');
      setPrice(80);
      setCost(35);
      setStockQuantity(50);
      setStockUnit('dish');
      setMinStockAlert(5);
      setImage('');
      setDescription('');
      setStatus('available');
      setKitchenStation('kitchen');
      setStrain('');
      setThcPercent(18);
      setCbdPercent(1);
      setVolumeMl(500);
    }
  }, [productToEdit, isOpen]);

  // When category changes, adjust default stockUnit and subcategory
  const handleCategoryChange = (cat: BusinessCategory) => {
    setCategory(cat);
    if (!productToEdit) {
      if (cat === 'food') {
        setStockUnit('dish');
        setSubcategory('อาหารจานเดียว');
        setCode('FOOD-' + Math.floor(1000 + Math.random() * 9000));
      } else if (cat === 'kratom') {
        setStockUnit('bottle');
        setSubcategory('เครื่องดื่มสมุนไพร');
        setCode('KT-' + Math.floor(1000 + Math.random() * 9000));
      } else if (cat === 'cannabis') {
        setStockUnit('g');
        setSubcategory('ช่อดอก (Flower)');
        setCode('CAN-' + Math.floor(1000 + Math.random() * 9000));
      } else {
        setStockUnit('pcs');
        setSubcategory('สินค้าทั่วไป');
        setCode('GEN-' + Math.floor(1000 + Math.random() * 9000));
      }
    }
  };

  // Handle File Upload to Base64 Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์รูปภาพเกิน 5MB กรุณาเลือกรูปภาพที่มีขนาดเล็กลง');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อเมนู/สินค้า');
      return;
    }

    const productPayload: Omit<Product, 'id'> = {
      name: name.trim(),
      code: code.trim() || 'SKU-' + Date.now(),
      category,
      subcategory: subcategory.trim(),
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      stockUnit,
      minStockAlert: Number(minStockAlert) || 1,
      image: image.trim() || undefined,
      description: description.trim() || undefined,
      status,
      ...(category === 'food' && {
        foodDetails: {
          kitchenStation,
          allowCustomNotes: true,
        },
      }),
      ...(category === 'cannabis' && {
        cannabisDetails: {
          strain: strain.trim() || name.trim(),
          thcPercent: Number(thcPercent) || 0,
          cbdPercent: Number(cbdPercent) || 0,
          controlledHerbLicenseRequired: true,
        },
      }),
      ...(category === 'kratom' && {
        kratomDetails: {
          volumeMl: Number(volumeMl) || 500,
          fdaWarningLabel: 'ห้ามจำหน่ายแก่สตรีมีครรภ์และผู้มีอายุต่ำกว่า 18 ปี',
        },
      }),
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
      alert('แก้ไขข้อมูลเมนู/สินค้าเรียบร้อยแล้ว');
    } else {
      addProduct(productPayload);
      alert('เพิ่มเมนู/สินค้าใหม่เข้าสู่ระบบเรียบร้อยแล้ว');
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-slate-800 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                {productToEdit ? 'แก้ไขเมนู / สินค้า' : 'เพิ่มเมนู / สินค้าใหม่'}
              </h3>
              <p className="text-xs text-slate-500">
                ระบุรายละเอียด ราคา สต็อก และรูปภาพเมนูสำหรับแสดงในระบบ POS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Category Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              1. เลือกหมวดหมู่ธุรกิจ (Business Category) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('food')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition ${
                  category === 'food'
                    ? 'bg-orange-50 border-orange-500 text-orange-900 font-bold ring-2 ring-orange-400/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Utensils className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-xs">🍜 อาหาร</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('kratom')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition ${
                  category === 'kratom'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-400/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Coffee className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs">🥤 กระท่อม</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('cannabis')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition ${
                  category === 'cannabis'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Leaf className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs">🌿 กัญชา</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('general')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition ${
                  category === 'general'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-2 ring-purple-400/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-xs">📦 สินค้าทั่วไป</span>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ชื่อเมนู / สินค้า <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ผัดไทยกุ้งสด, ชาเขียวเย็น"
                className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                รหัสสินค้า / SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น FOOD-101"
                className="w-full bg-white text-slate-800 text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">หมวดหมู่ย่อย (Subcategory)</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="เช่น อาหารจานเดียว, เครื่องดื่ม, ช่อดอก"
                className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">สถานะสินค้า</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="available">พร้อมขาย (Available)</option>
                <option value="out_of_stock">สินค้าหมด (Out of stock)</option>
                <option value="disabled">ระงับการขาย (Disabled)</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ราคาขาย (บาท)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white text-emerald-700 font-extrabold font-mono text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ต้นทุน (บาท)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-white text-slate-800 font-mono text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">สต็อกเริ่มต้น</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-white text-slate-900 font-mono text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">หน่วยนับ</label>
              <select
                value={stockUnit}
                onChange={(e) => setStockUnit(e.target.value as any)}
                className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="dish">จาน / ชาม (Dish)</option>
                <option value="bottle">ขวด / แก้ว (Bottle)</option>
                <option value="g">กรัม (Grams)</option>
                <option value="pcs">ชิ้น (Pcs)</option>
                <option value="pack">แพ็ค (Pack)</option>
              </select>
            </div>
          </div>

          {/* Category Specific Options */}
          {category === 'food' && (
            <div className="bg-orange-50/60 p-3 rounded-2xl border border-orange-200">
              <label className="block font-bold text-orange-900 mb-1">สถานีครัวสั่งอาหาร (Kitchen Station)</label>
              <div className="flex space-x-3 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="kitchenStation"
                    checked={kitchenStation === 'kitchen'}
                    onChange={() => setKitchenStation('kitchen')}
                  />
                  <span>ครัวประกอบอาหารหลัก (Main Kitchen)</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="kitchenStation"
                    checked={kitchenStation === 'bar'}
                    onChange={() => setKitchenStation('bar')}
                  />
                  <span>บาร์น้ำ/เครื่องดื่ม (Bar)</span>
                </label>
              </div>
            </div>
          )}

          {category === 'cannabis' && (
            <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200 grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">สายพันธุ์ (Strain)</label>
                <input
                  type="text"
                  value={strain}
                  onChange={(e) => setStrain(e.target.value)}
                  placeholder="เช่น KD Koh Tao"
                  className="w-full bg-white text-xs p-2 rounded-xl border border-emerald-300"
                />
              </div>
              <div>
                <label className="block font-bold text-emerald-900 mb-1">THC (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={thcPercent}
                  onChange={(e) => setThcPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white font-mono text-xs p-2 rounded-xl border border-emerald-300"
                />
              </div>
              <div>
                <label className="block font-bold text-emerald-900 mb-1">CBD (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cbdPercent}
                  onChange={(e) => setCbdPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white font-mono text-xs p-2 rounded-xl border border-emerald-300"
                />
              </div>
            </div>
          )}

          {/* Image Upload Component */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>รูปภาพเมนู / สินค้า (Menu Image)</span>
              </label>

              {image && (
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center space-x-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบรูปภาพ</span>
                </button>
              )}
            </div>

            {/* Image Preview */}
            {image ? (
              <div className="relative w-full h-40 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden group flex items-center justify-center">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition"
                  >
                    เปลี่ยนรูปภาพ
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Image Input Type Selector */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                      imageTab === 'upload'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📁 อัปโหลดไฟล์จากเครื่อง
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                      imageTab === 'presets'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🖼️ รูปตัวอย่างสำเร็จรูป
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                      imageTab === 'url'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔗 ระบุ Image URL
                  </button>
                </div>

                {imageTab === 'upload' && (
                  <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition">
                    <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                    <span className="font-bold text-slate-700 text-xs">
                      คลิกเพื่อเลือกไฟล์รูปภาพจากอุปกรณ์
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      รองรับไฟล์ .JPG, .PNG, .WEBP (ขนาดไม่เกิน 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {imageTab === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className="group relative rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-500 focus:outline-none transition aspect-square"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 p-1 text-[9px] text-white font-medium truncate text-center">
                          {preset.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {imageTab === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">รายละเอียดคำอธิบายสินค้าเพิ่มเติม</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุวัตถุดิบ รสชาติ หรือคำอธิบายเพิ่มเติม..."
              className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'บันทึกการแก้ไข' : 'บันทึกเพิ่มเมนูใหม่'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
