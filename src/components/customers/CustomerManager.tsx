import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Customer } from '../../types';
import { Users, Plus, Search, FileText, Award, Calendar, Phone } from 'lucide-react';

export const CustomerManager: React.FC = () => {
  const { customers, setCustomers, orders } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // New Customer State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [medicalNote, setMedicalNote] = useState('');

  const filteredCustomers = (customers || []).filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      memberCode: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name,
      phone,
      birthDate,
      points: 0,
      totalSpend: 0,
      medicalHistoryNote: medicalNote,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setShowAddCustomerModal(false);
    setName('');
    setPhone('');
    alert(`เพิ่มสมาชิก ${name} เรียบร้อยแล้ว`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-100 p-3 rounded-2xl border border-emerald-200 text-emerald-700">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ระบบสมาชิกเเละประวัติผู้ป่วย (Customer & Patient Records)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              สะสมแต้มส่วนลด ตรวจสอบอายุ (20+) เเละบันทึกประวัติการใช้สมุนไพรควบคุม
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสมาชิกใหม่</span>
        </button>
      </div>

      {/* Customer Grid */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ เบอร์โทรศัพท์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-emerald-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-800 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {c.memberCode}
                </span>
                <span className="text-amber-700 font-bold text-xs font-mono flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {c.points} แต้ม
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>ยอดซื้อสะสม:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    ฿{c.totalSpend.toLocaleString()}
                  </span>
                </div>
                {c.medicalHistoryNote && (
                  <p className="text-[11px] text-emerald-800 font-medium italic pt-1 border-t border-slate-200">
                    โน้ตทางการแพทย์: {c.medicalHistoryNote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">เพิ่มสมาชิกใหม่</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">ชื่อ-นามสกุล:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">เบอร์โทรศัพท์:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">วันเกิด (สำหรับตรวจอายุ 20+):</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  โน้ตสุขภาพ / ใบสั่งจ่ายยา (ถ้ามี):
                </label>
                <textarea
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 h-20"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl border border-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  บันทึกสมาชิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
