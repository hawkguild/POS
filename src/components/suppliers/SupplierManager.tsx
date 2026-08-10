import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Supplier } from '../../types';
import { Truck, Plus, Search, FileText, Phone, Building, CheckCircle2 } from 'lucide-react';

export const SupplierManager: React.FC = () => {
  const { suppliers, setSuppliers, cannabisLots, orders } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-teal-50/80 p-6 rounded-2xl border border-teal-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-teal-100 p-3 rounded-2xl border border-teal-200 text-teal-700">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ระบบจัดการซัพพลายเออร์เเละการตรวจสอบย้อนหลัง (Supplier Traceability)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              จัดเก็บใบอนุญาตซัพพลายเออร์ Traceability: ซัพพลายเออร์ → Lot รับเข้า → ยอดขาย → สต็อกคงเหลือ
            </p>
          </div>
        </div>
      </div>

      {/* Supplier List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาซัพพลายเออร์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 shadow-xs"
            />
          </div>

          <div className="space-y-2">
            {filteredSuppliers.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                  selectedSupplier?.id === s.id
                    ? 'bg-teal-50/90 border-teal-400 shadow-xs ring-1 ring-teal-400/30'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-200 font-bold">
                    {s.code}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">Active</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-1.5">{s.companyName}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.contactPerson} ({s.phone})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details & Traceability Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          {selectedSupplier ? (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-teal-700 font-semibold">{selectedSupplier.code}</span>
                  <h3 className="font-bold text-lg text-slate-900">{selectedSupplier.companyName}</h3>
                  <p className="text-xs text-slate-500">{selectedSupplier.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">เลขผู้เสียภาษี:</span>
                  <p className="font-mono font-bold text-slate-800">{selectedSupplier.taxId}</p>
                </div>
                <div>
                  <span className="text-slate-500">ใบอนุญาตซัพพลายเออร์:</span>
                  <p className="font-mono font-bold text-emerald-700">
                    {selectedSupplier.licenseNumber || 'ใบอนุญาตสมบูรณ์'}
                  </p>
                </div>
              </div>

              {/* Traceability Section */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-sm text-teal-800">
                  แผนผังตรวจสอบย้อนหลัง (Lot Traceability Map):
                </h4>

                <div className="space-y-2 text-xs">
                  {cannabisLots
                    .filter((l) => l.supplierId === selectedSupplier.id)
                    .map((lot) => (
                      <div
                        key={lot.id}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1"
                      >
                        <div className="flex justify-between font-bold text-slate-900">
                          <span className="text-emerald-700 font-mono">Lot: {lot.lotNumber}</span>
                          <span>{lot.strain}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          COA: {lot.coaNumber} | วันที่รับเข้า: {lot.receivedDate}
                        </p>
                        <div className="flex justify-between pt-1 border-t border-slate-200 font-mono">
                          <span className="text-slate-600">รับเข้า: {lot.initialWeightGrams} g</span>
                          <span className="text-emerald-700 font-bold">
                            คงเหลือในคลัง: {lot.remainingWeightGrams} g
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 text-xs font-medium">
              คลิกเลือกซัพพลายเออร์จากรายการฝั่งซ้ายเพื่อดูรายละเอียดเเละ Lot Traceability Map
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
