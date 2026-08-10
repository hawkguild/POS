import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { KratomBatch, KratomRecipeItem } from '../../types';
import {
  Coffee,
  Plus,
  Beaker,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

export const KratomManager: React.FC = () => {
  const { kratomBatches, produceKratomBatch, products, shopSettings } = usePOS();
  const [showProduceModal, setShowProduceModal] = useState(false);

  // New Batch Form State
  const [productName, setProductName] = useState('น้ำกระท่อมต้มสด 100% (เกรดพรีเมียม)');
  const [batchNo, setBatchNo] = useState(`KT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`);
  const [producedVolume, setProducedVolume] = useState(10); // Liters
  const [yieldBottles, setYieldBottles] = useState(20); // Bottles
  const [bottleSizeMl, setBottleSizeMl] = useState(500);

  // Raw Material Costs
  const [leafGrams, setLeafGrams] = useState(500);
  const [leafCost, setLeafCost] = useState(150);
  const [flavorCost, setFlavorCost] = useState(120); // มะนาว/น้ำเชื่อม
  const [packagingCost, setPackagingCost] = useState(30); // ขวดเเละฉลาก

  const totalCost = leafCost + flavorCost + packagingCost;
  const costPerLiter = producedVolume > 0 ? totalCost / producedVolume : 0;
  const costPerBottle = yieldBottles > 0 ? totalCost / yieldBottles : 0;
  const suggestedSellingPrice = 50; // THB
  const profitMarginPercent = costPerBottle > 0 ? ((suggestedSellingPrice - costPerBottle) / suggestedSellingPrice) * 100 : 0;

  const handleProduceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipe: KratomRecipeItem[] = [
      {
        ingredientId: 'ing-kt-leaf',
        ingredientName: 'ใบกระท่อมสดก้านแดง (สุราษฎร์)',
        quantityNeeded: leafGrams,
        unit: 'g',
      },
      {
        ingredientId: 'ing-water',
        ingredientName: 'น้ำกรอง RO',
        quantityNeeded: producedVolume,
        unit: 'L',
      },
      {
        ingredientId: 'ing-packaging',
        ingredientName: `ขวดบรรจุ ${bottleSizeMl}ml พร้อมฉลาก อย.`,
        quantityNeeded: yieldBottles,
        unit: 'pcs',
      },
    ];

    produceKratomBatch({
      batchNo,
      productName,
      producedVolumeLiters: producedVolume,
      yieldBottles,
      bottleSizeMl,
      leafWeightGrams: leafGrams,
      totalCostThb: totalCost,
      costPerLiterThb: costPerLiter,
      costPerBottleThb: costPerBottle,
      fdaCompliantLabel: true,
      recipe,
    });

    setShowProduceModal(false);
    alert(`ผลิตเเละบันทึก Batch ${batchNo} สำเร็จ! ระบบได้ทำการตัดสต็อกใบกระท่อม ${leafGrams}g เรียบร้อยแล้ว`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-2xl border border-blue-200 text-blue-700">
            <Coffee className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                ระบบสูตรเเละบันทึกการต้มน้ำกระท่อม (Kratom Recipe & Batch Studio)
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                อย. Compliant
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              คำนวณต้นทุน/ลิตร, ต้นทุน/ขวด, กำไรเเละตัดสต็อกวัตถุดิบใบกระท่อมเเละส่วนผสมโดยอัตโนมัติตาม
              Batch การผลิต
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowProduceModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ต้มผลิต Batch ใหม่</span>
        </button>
      </div>

      {/* Batch Cards Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <Beaker className="w-4 h-4 text-blue-600" />
          <span>รายการ Batch การต้มผลิตน้ำกระท่อม (Batch Production History)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kratomBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-blue-800 text-sm font-extrabold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {batch.batchNo}
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-200">
                  {batch.productionDate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{batch.productName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ปริมาณผลิต: <span className="text-slate-900 font-bold">{batch.producedVolumeLiters} ลิตร</span>{' '}
                  ({batch.yieldBottles} ขวด @ {batch.bottleSizeMl}ml)
                </p>
              </div>

              {/* Recipe & Cost Calculation */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">ใบกระท่อมที่ใช้:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {batch.leafWeightGrams} g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ต้นทุนรวม Batch:</span>
                  <span className="font-mono text-amber-700 font-bold">
                    ฿{batch.totalCostThb.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">ต้นทุน/ลิตร:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    ฿{batch.costPerLiterThb.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ต้นทุน/ขวด:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    ฿{batch.costPerBottleThb.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* FDA Compliance Label Check */}
              <div className="bg-blue-50 p-2 rounded-xl border border-blue-200 text-[10px] text-blue-900 flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  ติดฉลากเตือนตามประกาศ อย.
                </span>
                <span className="font-mono text-emerald-800 font-bold">อย. {shopSettings.kratomFdaNo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Produce Batch Modal */}
      {showProduceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">บันทึกการต้มผลิตน้ำกระท่อม 1 Batch</h3>
              </div>
              <button
                onClick={() => setShowProduceModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProduceSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">ชื่อสูตร / เครื่องดื่ม:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">เลข Batch No.:</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">ปริมาตรต้ม (ลิตร):</label>
                  <input
                    type="number"
                    value={producedVolume}
                    onChange={(e) => setProducedVolume(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">จำนวนขวดที่บรรจุได้:</label>
                  <input
                    type="number"
                    value={yieldBottles}
                    onChange={(e) => setYieldBottles(parseInt(e.target.value) || 0)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">ขนาดขวด (ml):</label>
                  <input
                    type="number"
                    value={bottleSizeMl}
                    onChange={(e) => setBottleSizeMl(parseInt(e.target.value) || 0)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Ingredients & Costs */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-blue-700">คำนวณวัตถุดิบเเละต้นทุนผลิต:</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 text-[10px] font-medium">น้ำหนักใบกระท่อม (g):</label>
                    <input
                      type="number"
                      value={leafGrams}
                      onChange={(e) => setLeafGrams(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-slate-800 p-1.5 rounded border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-[10px] font-medium">ค่าใบกระท่อม (฿):</label>
                    <input
                      type="number"
                      value={leafCost}
                      onChange={(e) => setLeafCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-slate-800 p-1.5 rounded border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-[10px] font-medium">ค่าน้ำ/มะนาว/ปรุงรส (฿):</label>
                    <input
                      type="number"
                      value={flavorCost}
                      onChange={(e) => setFlavorCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-slate-800 p-1.5 rounded border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-[10px] font-medium">ค่าขวด/บรรจุภัณฑ์ (฿):</label>
                    <input
                      type="number"
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-slate-800 p-1.5 rounded border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                {/* Auto Calculated Banner */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-slate-700 shadow-xs">
                  <div className="flex justify-between font-bold">
                    <span>ต้นทุนรวมทั้งหมด:</span>
                    <span className="font-mono text-amber-700">฿{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>ต้นทุน/ลิตร: ฿{costPerLiter.toFixed(2)}</span>
                    <span>ต้นทุน/ขวด: ฿{costPerBottle.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                    <span>ราคาขายแนะนำ ฿{suggestedSellingPrice}/ขวด</span>
                    <span>กำไรขั้นต้น: {profitMarginPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProduceModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl border border-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  บันทึกต้มผลิต & ตัดสต็อกใบ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
