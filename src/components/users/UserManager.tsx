import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { User, UserRole } from '../../types';
import {
  Users,
  UserPlus,
  Trash2,
  Edit,
  Shield,
  ShieldAlert,
  Key,
  Lock,
  UserCheck,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const { currentUser, users, addUser, updateUser, deleteUser } = usePOS();
  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'manager';

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('P@ssw0rd');
  const [role, setRole] = useState<UserRole>('cashier');
  const [pin, setPin] = useState('1234');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  );

  const resetForm = () => {
    setName('');
    setUsername('');
    setPassword('P@ssw0rd');
    setRole('cashier');
    setPin('1234');
    setAvatar(
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    );
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setUsername(u.username || '');
    setPassword(u.password || 'P@ssw0rd');
    setRole(u.role);
    setPin(u.pin || '1234');
    setAvatar(
      u.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addUser({
      name,
      username: username.trim() || name.toLowerCase().replace(/\s+/g, '_'),
      password,
      role,
      pin,
      avatar,
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name,
      username,
      password,
      role,
      pin,
      avatar,
    });

    setEditingUser(null);
    resetForm();
  };

  const handleDelete = (u: User) => {
    if (u.id === currentUser.id) {
      alert('ไม่สามารถลบผู้ใช้งานที่กำลังล็อกอินอยู่ในปัจจุบันได้');
      return;
    }
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${u.name}" (${u.username || u.id}) ออกจากระบบ?`)) {
      deleteUser(u.id);
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cashier':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'warehouse':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'kitchen':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRoleName = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return 'Super Admin (เจ้าของร้าน)';
      case 'manager':
        return 'Manager (ผู้จัดการร้าน)';
      case 'cashier':
        return 'Cashier (แคชเชียร์หน้าร้าน)';
      case 'warehouse':
        return 'Warehouse (เจ้าหน้าที่คลัง)';
      case 'kitchen':
        return 'Kitchen (พ่อครัว/บาร์น้ำ)';
      default:
        return r;
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-4 my-8">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">เฉพาะ Admin หรือ ผู้จัดการ เท่านั้น</h2>
        <p className="text-xs text-slate-500">
          บัญชีปัจจุบันของคุณ ({currentUser.name} - {currentUser.role}) ไม่มีสิทธิ์จัดการผู้ใช้งานระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600/30 p-3.5 rounded-2xl border border-indigo-500/40 text-indigo-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">จัดการผู้ใช้งานระบบ (User Management)</h2>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2.5 py-0.5 rounded-full border border-purple-400/30 font-semibold">
                Admin Privilege
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              เพิ่ม, ลบ, แก้ไขชื่อผู้ใช้, รหัสผ่าน, กำหนดสิทธิ์ และบันทึกลง Firestore โดยตรง
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-2 text-xs transition self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ เพิ่มผู้ใช้ใหม่</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="font-bold text-sm text-slate-800 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>รายชื่อผู้ได้รับสิทธิ์เข้าใช้งาน ({users.length} รายชื่อ)</span>
          </div>
          <span className="text-xs text-slate-500">
            * สิทธิ์ Admin สามารถสลับ ปรับเปลี่ยน หรือลบผู้ใช้ได้ทันที
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">ผู้ใช้งาน</th>
                <th className="p-4">Username / รหัสผ่าน</th>
                <th className="p-4">บทบาท (Role)</th>
                <th className="p-4">PIN สลับหน้า</th>
                <th className="p-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(users || []).map((u) => {
                const isSelf = u.id === currentUser.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                          }
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-semibold border border-emerald-300">
                                (คุณ)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.username || u.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                          <Key className="w-3 h-3 text-slate-400" />
                          <span>Password: {u.password || '••••••••'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRoleBadge(
                          u.role
                        )}`}
                      >
                        {getRoleName(u.role)}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">{u.pin || '----'}</td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-300"
                          title="แก้ไขผู้ใช้งาน"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(u)}
                          disabled={isSelf}
                          className={`p-2 rounded-xl transition border ${
                            isSelf
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                          }`}
                          title={isSelf ? 'ไม่สามารถลบบัญชีตัวเองได้' : 'ลบผู้ใช้งาน'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">เพิ่มผู้ใช้งานใหม่ (Add User)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">ชื่อ-นามสกุล:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  ชื่อล็อกอิน (Username):
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น somchai หรือ admin_assistant"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">รหัสผ่าน (Password):</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="P@ssw0rd"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">PIN (4 หลัก):</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    placeholder="1234"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-mono text-center"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">สิทธิ์การใช้งาน (Role):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-semibold"
                >
                  <option value="super_admin">Super Admin (เจ้าของร้าน - สิทธิ์เต็ม)</option>
                  <option value="manager">Manager (ผู้จัดการร้าน)</option>
                  <option value="cashier">Cashier (แคชเชียร์หน้าร้าน)</option>
                  <option value="warehouse">Warehouse (เจ้าหน้าที่คลังสินค้า)</option>
                  <option value="kitchen">Kitchen (พ่อครัว/บาร์น้ำ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">รูปโปรไฟล์ (Avatar URL):</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-[11px]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกผู้ใช้</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">แก้ไขข้อมูลผู้ใช้ (Edit User)</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">ชื่อ-นามสกุล:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  ชื่อล็อกอิน (Username):
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">รหัสผ่าน (Password):</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">PIN (4 หลัก):</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-mono text-center"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">สิทธิ์การใช้งาน (Role):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-semibold"
                >
                  <option value="super_admin">Super Admin (เจ้าของร้าน - สิทธิ์เต็ม)</option>
                  <option value="manager">Manager (ผู้จัดการร้าน)</option>
                  <option value="cashier">Cashier (แคชเชียร์หน้าร้าน)</option>
                  <option value="warehouse">Warehouse (เจ้าหน้าที่คลังสินค้า)</option>
                  <option value="kitchen">Kitchen (พ่อครัว/บาร์น้ำ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">รูปโปรไฟล์ (Avatar URL):</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-[11px]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>อัปเดตข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
