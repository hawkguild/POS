import React from 'react';
import { useTheme, THEMES, ThemeId } from '../../context/ThemeContext';
import { Palette, Check, RefreshCw, X, Sparkles } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { themeId, setThemeId, activeTheme, rollRandomTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl flex flex-col space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div
              className="p-2.5 rounded-2xl text-white shadow-md"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">เปลี่ยนธีมสีประจำร้าน (5 แบบ)</h3>
              <p className="text-xs text-slate-500">เลือกโทนสีการใช้งานตามสไตล์ร้านค้าของคุณ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options Grid */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const theme = THEMES[id];
            const isSelected = themeId === id;

            return (
              <div
                key={id}
                onClick={() => setThemeId(id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Swatch Preview Circle */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className="w-9 h-9 rounded-xl border-2 border-white shadow-md flex items-center justify-center overflow-hidden"
                      style={{
                        background:
                          id === 'random'
                            ? activeTheme.swatch[1]
                            : `linear-gradient(135deg, ${theme.swatch[0]} 50%, ${theme.swatch[1]} 50%)`,
                      }}
                    >
                      {id === 'random' && <Sparkles className="w-4 h-4 text-white animate-spin" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm">{theme.name}</span>
                      {id === 'emerald' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {theme.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {id === 'random' && isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rollRandomTheme();
                      }}
                      className="p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      title="สุ่มสีใหม่"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">สุ่มใหม่</span>
                    </button>
                  )}

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview Box */}
        <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <span className="text-xs font-bold text-slate-500 block">ตัวอย่างการแสดงผลธีมปัจจุบัน:</span>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl font-bold text-white shadow-xs"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              ปุ่มหลัก
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl font-bold border"
              style={{
                backgroundColor: activeTheme.shades[50],
                borderColor: activeTheme.shades[200],
                color: activeTheme.shades[800],
              }}
            >
              ปุ่มรอง
            </button>
            <span
              className="px-2.5 py-1 rounded-full font-extrabold border text-[11px]"
              style={{
                backgroundColor: activeTheme.shades[50],
                borderColor: activeTheme.shades[200],
                color: activeTheme.shades[800],
              }}
            >
              {activeTheme.name}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
          >
            บันทึกและปิด
          </button>
        </div>
      </div>
    </div>
  );
};
