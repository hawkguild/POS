import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Store,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Leaf,
  CheckCircle2,
  Award,
  Zap,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = usePOS();
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
    <div className="min-h-full py-8 bg-slate-50 text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-emerald-600 selection:text-white">
      {/* Soft Ambient Cannabis Green Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-100/30 to-green-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-950/10 overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 my-auto">
        {/* Left Side: Modern Cannabis Feature Banner (Visible on MD screens) */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative leaf watermark */}
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <Leaf className="w-64 h-64 text-emerald-300" />
          </div>

          <div className="space-y-6 relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cannabis & Retail POS พ.ศ. 2569</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                ระบบจัดการร้านค้ากัญชา <br />
                <span className="text-emerald-300">และธุรกิจครบวงจร</span>
              </h2>
              <p className="text-emerald-100/80 text-xs leading-relaxed">
                รองรับการควบคุมสมุนไพรตามกฎหมาย พ.ศ. 2569 บันทึก COA, Traceability QR Code, การควบคุมสต็อกชั่งน้ำหนัก และ POS หน้าร้าน
              </p>
            </div>

            {/* Core Capabilities List */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>สแกน QR Compliance ตรวจสอบย้อนกลับ</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>คุมสต็อกน้ำหนักกรัม (Grams) ละเอียดแม่นยำ</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>ออกใบเสร็จรับเงิน & PromptPay QR ชำระเงิน</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>บันทึกประวัติการขายและ Audit Trail ในระบบ</span>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-6 mt-6 border-t border-emerald-700/50 flex items-center justify-between text-[11px] text-emerald-200/80 relative z-10">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ปลอดภัยผ่าน Cloud Firestore</span>
            </span>
            <span className="font-mono text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded text-emerald-300">
              v2026.8
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-5">
            {/* Header Branding Mobile & Desktop */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-600/30">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  THAI MULTI POS
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  เข้าสู่ระบบบริหารจัดการร้านค้า (Login)
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs flex items-center space-x-2 animate-shake">
                <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex justify-between items-center">
                  <span>ชื่อผู้ใช้ (Username):</span>
                  <span className="text-[10px] text-emerald-700 font-normal bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ทดสอบ: admin
                  </span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ระบุชื่อผู้ใช้ เช่น admin"
                    className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex justify-between items-center">
                  <span>รหัสผ่าน (Password / PIN):</span>
                  <span className="text-[10px] text-emerald-700 font-normal bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ทดสอบ: P@ssw0rd
                  </span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ระบุรหัสผ่าน"
                    className="w-full bg-slate-50 text-slate-900 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 text-xs sm:text-sm transition cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse">กำลังเข้าสู่ระบบ...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>เข้าสู่ระบบ (Sign In)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>เข้าใช้งานด่วนด้วยบัญชีทดลอง (Demo Account Quick Select):</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'P@ssw0rd')}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer"
                >
                  <div className="font-bold flex items-center justify-between text-xs">
                    <span>🔑 Admin</span>
                    <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                      สิทธิ์เต็ม
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">admin / P@ssw0rd</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('manager', 'P@ssw0rd')}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer"
                >
                  <div className="font-bold flex items-center justify-between text-xs">
                    <span>👨‍💼 Manager</span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                      ผู้จัดการ
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">manager / P@ssw0rd</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('cashier', 'P@ssw0rd')}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer"
                >
                  <div className="font-bold flex items-center justify-between text-xs">
                    <span>💳 Cashier</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                      แคชเชียร์
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">cashier / P@ssw0rd</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('kitchen', 'P@ssw0rd')}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer"
                >
                  <div className="font-bold flex items-center justify-between text-xs">
                    <span>🍳 Kitchen</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      พนักงานครัว
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">kitchen / P@ssw0rd</div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            ระบบลงทะเบียนกัญชาและธุรกิจผสมผสาน • Thai Cannabis Compliance 2026
          </div>
        </div>
      </div>
    </div>
  );
};
