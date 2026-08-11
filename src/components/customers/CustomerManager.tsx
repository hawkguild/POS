import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Customer } from '../../types';
import {
  Users,
  Plus,
  Search,
  Award,
  Phone,
  Calendar,
  Edit3,
  Trash2,
  ShieldCheck,
  HeartPulse,
  X,
  Check,
  FileText,
  Hash,
  DollarSign,
  UserCheck,
} from 'lucide-react';

export const CustomerManager: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [points, setPoints] = useState<number>(0);
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [medicalNote, setMedicalNote] = useState('');

  // Filtered list
  const filteredCustomers = (customers || []).filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.memberCode && c.memberCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Totals
  const totalMembers = (customers || []).length;
  const grandTotalPoints = (customers || []).reduce((acc, c) => acc + (c.points || 0), 0);
  const grandTotalSpend = (customers || []).reduce((acc, c) => acc + (c.totalSpend || 0), 0);

  // Calculate Age helper
  const calculateAge = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return isNaN(age) ? null : age;
  };

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setMemberCode(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
    setBirthDate('1995-01-01');
    setPoints(0);
    setTotalSpend(0);
    setMedicalNote('');
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setName(cust.name);
    setPhone(cust.phone);
    setMemberCode(cust.memberCode || '');
    setBirthDate(cust.birthDate || '1995-01-01');
    setPoints(cust.points || 0);
    setTotalSpend(cust.totalSpend || 0);
    setMedicalNote(cust.medicalHistoryNote || '');
    setShowModal(true);
  };

  // Save (Add or Update)
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์');
      return;
    }

    if (editingCustomer) {
      // Update existing
      updateCustomer(editingCustomer.id, {
        name: name.trim(),
        phone: phone.trim(),
        memberCode: memberCode.trim(),
        birthDate,
        points: Number(points) || 0,
        totalSpend: Number(totalSpend) || 0,
        medicalHistoryNote: medicalNote.trim(),
      });
      alert(`อัปเดตข้อมูลสมาชิก "${name.trim()}" เรียบร้อยแล้ว`);
    } else {
      // Add new
      addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        memberCode: memberCode.trim(),
        birthDate,
        points: Number(points) || 0,
        totalSpend: Number(totalSpend) || 0,
        medicalHistoryNote: medicalNote.trim(),
      });
      alert(`เพิ่มสมาชิกใหม่ "${name.trim()}" เรียบร้อยแล้ว`);
    }

    setShowModal(false);
  };

  // Confirm Delete
  const handleDelete = (id: string) => {
    const success = deleteCustomer(id);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 p-6 rounded-3xl text-white shadow-lg border border-red-800/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-red-500/20 p-3.5 rounded-2xl border border-red-500/30 text-red-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer & Patient Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ระบบสมาชิก & บันทึกประวัติผู้ป่วย
            </h2>
            <p className="text-xs text-rose-200/80 mt-1">
              จัดการข้อมูลสมาชิก สะสมแต้ม ตรวจสอบอายุ (20+) และประวัติสุขภาพการใช้สมุนไพรควบคุม
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-red-900/30 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสมาชิกใหม่</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">สมาชิกทั้งหมด</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalMembers} คน</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">แต้มสะสมรวมทั้งร้าน</p>
            <p className="text-2xl font-black text-amber-600 font-mono mt-1">
              {grandTotalPoints.toLocaleString()} <span className="text-sm font-normal">แต้ม</span>
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">ยอดซื้อสะสมรวมสมาชิก</p>
            <p className="text-2xl font-black text-emerald-600 font-mono mt-1">
              ฿{grandTotalSpend.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาด้วย ชื่อ, เบอร์โทรศัพท์ หรือ รหัสสมาชิก..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-xs transition font-medium"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
            พบสมาชิก <span className="font-bold text-slate-800">{filteredCustomers.length}</span> รายการ
          </div>
        </div>

        {/* Customer Cards Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">ไม่พบข้อมูลสมาชิกที่ค้นหา</p>
            <p className="text-xs text-slate-400">ลองเปลี่ยนคำค้นหา หรือกด "เพิ่มสมาชิกใหม่"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c) => {
              const age = calculateAge(c.birthDate);
              const isOver20 = age !== null && age >= 20;

              return (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs hover:border-red-300 hover:shadow-md transition relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Points */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-red-800 text-xs font-black bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
                          {c.memberCode}
                        </span>
                        {age !== null && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isOver20
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {age} ปี {isOver20 ? '(20+ ผ่าน)' : '(ต่ำกว่า 20)'}
                          </span>
                        )}
                      </div>

                      <span className="text-amber-700 font-extrabold text-xs font-mono flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {c.points} แต้ม
                      </span>
                    </div>

                    {/* Member Details */}
                    <div className="pt-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-red-500" /> {c.phone}
                      </p>
                    </div>

                    {/* Stats & Medical Note */}
                    <div className="mt-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>ยอดซื้อสะสม:</span>
                        <span className="font-mono text-emerald-700 font-extrabold text-sm">
                          ฿{c.totalSpend.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>วันที่สมัคร:</span>
                        <span className="font-mono">{c.registeredDate || '-'}</span>
                      </div>

                      {c.medicalHistoryNote && (
                        <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-700 space-y-0.5">
                          <span className="font-bold text-red-700 flex items-center gap-1">
                            <HeartPulse className="w-3 h-3 text-red-500" /> โน้ตประวัติสุขภาพ:
                          </span>
                          <p className="text-slate-600 bg-white p-2 rounded-lg border border-slate-200 text-[11px] italic leading-relaxed">
                            {c.medicalHistoryNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl text-xs font-bold border border-slate-200 hover:border-red-200 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>แก้ไข</span>
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(c.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 rounded-xl text-xs font-bold border border-slate-200 hover:border-rose-200 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {editingCustomer ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น คุณสมชาย เข็มทอง"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="เช่น 0812345678"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold flex items-center space-x-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>รหัสสมาชิก:</span>
                  </label>
                  <input
                    type="text"
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    placeholder="เช่น CUST-101"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>วันเกิด (ตรวจอายุ 20+):</span>
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Editable Points & Total Spend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>แต้มสะสม:</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ยอดซื้อสะสม (บาท):</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalSpend}
                    onChange={(e) => setTotalSpend(Number(e.target.value))}
                    className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold flex items-center space-x-1">
                  <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                  <span>โน้ตประวัติสุขภาพ / ใบสั่งแพทย์ / ข้อควรระวัง:</span>
                </label>
                <textarea
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  placeholder="เช่น ประวัตินอนไม่หลับ, มีโรคประจำตัว, หรือต้องการใช้กัญชาควบคุมแบบผ่อนคลาย"
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 h-24 text-xs leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 cursor-pointer transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl shadow-md shadow-red-600/20 flex items-center space-x-1.5 cursor-pointer transition"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกข้อมูลสมาชิก</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 text-slate-800 shadow-2xl space-y-4 text-center">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">ยืนยันการลบสมาชิก?</h3>
              <p className="text-xs text-slate-500 mt-1">
                การลบสมาชิกนี้ จะไม่สามารถดึงข้อมูลแต้มหรือประวัติกลับมาได้
              </p>
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                ยืนยันลบสมาชิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
