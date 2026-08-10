import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Store,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, users } = usePOS();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('P@ssw0rd');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      setLoading(false);
      if (!success) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ลองใช้ admin / P@ssw0rd)');
      }
    }, 400);
  };

  const handleQuickLogin = (usr: string, pass: string) => {
    setUsername(usr);
    setPassword(pass);
    setError('');
    login(usr, pass);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl shadow-lg border border-emerald-400/30 mb-1">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            THAI MULTI BUSINESS POS
          </h1>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <span>🌿 กัญชา</span>
            <span>•</span>
            <span>🥤 กระท่อม</span>
            <span>•</span>
            <span>🍜 ครัวอาหาร</span>
            <span>•</span>
            <span>📦 สินค้าทั่วไป</span>
          </p>
          <div className="inline-block bg-emerald-500/10 text-emerald-400 text-[11px] px-3 py-1 rounded-full border border-emerald-500/30 font-semibold mt-1">
            ✨ ระบบบริหารจัดการ พ.ศ. 2569 Compliant
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center space-x-2 animate-shake">
            <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center justify-between">
              <span>ชื่อผู้ใช้ (Username):</span>
              <span className="text-[10px] text-emerald-400 font-normal">ทดสอบใช้: admin</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ระบุชื่อผู้ใช้ เช่น admin"
                className="w-full bg-slate-900/80 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center justify-between">
              <span>รหัสผ่าน / PIN:</span>
              <span className="text-[10px] text-emerald-400 font-normal">ทดสอบใช้: P@ssw0rd</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ระบุรหัสผ่าน เช่น P@ssw0rd"
                className="w-full bg-slate-900/80 text-white pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center space-x-2 text-sm transition transform active:scale-98"
          >
            {loading ? (
              <span className="animate-pulse">กำลังตรวจสอบสิทธิ์...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>เข้าสู่ระบบ (Login)</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-3 border-t border-slate-700/80 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>เข้าใช้งานด่วน (Demo Quick Login):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('admin', 'P@ssw0rd')}
              className="p-2 bg-purple-900/30 border border-purple-500/40 hover:bg-purple-800/40 rounded-xl text-left transition text-purple-200"
            >
              <div className="font-bold flex items-center justify-between">
                <span>🔑 Admin</span>
                <span className="text-[9px] bg-purple-500/30 px-1.5 py-0.2 rounded">สิทธิ์เต็ม</span>
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">admin / P@ssw0rd</div>
            </button>

            <button
              onClick={() => handleQuickLogin('manager', 'P@ssw0rd')}
              className="p-2 bg-blue-900/30 border border-blue-500/40 hover:bg-blue-800/40 rounded-xl text-left transition text-blue-200"
            >
              <div className="font-bold flex items-center justify-between">
                <span>👨‍💼 Manager</span>
                <span className="text-[9px] bg-blue-500/30 px-1.5 py-0.2 rounded">ผู้จัดการ</span>
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">manager / P@ssw0rd</div>
            </button>

            <button
              onClick={() => handleQuickLogin('cashier', 'P@ssw0rd')}
              className="p-2 bg-emerald-900/30 border border-emerald-500/40 hover:bg-emerald-800/40 rounded-xl text-left transition text-emerald-200"
            >
              <div className="font-bold flex items-center justify-between">
                <span>💳 Cashier</span>
                <span className="text-[9px] bg-emerald-500/30 px-1.5 py-0.2 rounded">ขายสินค้า</span>
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">cashier / P@ssw0rd</div>
            </button>

            <button
              onClick={() => handleQuickLogin('kitchen', 'P@ssw0rd')}
              className="p-2 bg-orange-900/30 border border-orange-500/40 hover:bg-orange-800/40 rounded-xl text-left transition text-orange-200"
            >
              <div className="font-bold flex items-center justify-between">
                <span>🍳 Kitchen</span>
                <span className="text-[9px] bg-orange-500/30 px-1.5 py-0.2 rounded">จอครัว</span>
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">kitchen / P@ssw0rd</div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500 pt-1 border-t border-slate-700/50">
          🔒 ข้อมูลการขายและ Audit Trail บันทึกลงระบบ Firestore อย่างปลอดภัย
        </div>
      </div>
    </div>
  );
};
