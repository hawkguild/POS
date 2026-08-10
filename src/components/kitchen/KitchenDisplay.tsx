import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { KitchenOrder } from '../../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  UtensilsCrossed,
  Filter,
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { kitchenOrders, updateKitchenItemStatus } = usePOS();
  const [stationFilter, setStationFilter] = useState<'all' | 'kitchen' | 'bar'>('all');

  const pendingOrPreparingOrders = kitchenOrders.filter(
    (o) => o.overallStatus !== 'served'
  );

  const getStatusColor = (status: KitchenOrder['overallStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-950';
      case 'preparing':
        return 'bg-orange-50 border-orange-200 text-orange-950';
      case 'ready':
        return 'bg-emerald-50 border-emerald-200 text-emerald-950';
      case 'served':
        return 'bg-slate-50 border-slate-200 text-slate-600';
      default:
        return 'bg-white border-slate-200 text-slate-800';
    }
  };

  const getStatusText = (status: KitchenOrder['overallStatus']) => {
    switch (status) {
      case 'pending':
        return '⏳ รอดำเนินการ';
      case 'preparing':
        return '🍳 กำลังปรุงอาหาร';
      case 'ready':
        return '✅ พร้อมเสิร์ฟ';
      case 'served':
        return '🛎️ เสิร์ฟแล้ว';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-orange-50/80 p-6 rounded-2xl border border-orange-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-2xl border border-orange-200 text-orange-700">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                จอแสดงผลออเดอร์ในครัว (Kitchen Display System - KDS)
              </h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-orange-200">
                Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              แสดงรายการอาหารเเละเครื่องดื่มที่สั่งเข้ามา ปรับสถานะทำอาหารและแจ้งเตือนพนักงานเสิร์ฟ
            </p>
          </div>
        </div>

        {/* Station Filter */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-xs self-start md:self-auto">
          <button
            onClick={() => setStationFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              stationFilter === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setStationFilter('kitchen')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              stationFilter === 'kitchen'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🍳 ครัวร้อน
          </button>
          <button
            onClick={() => setStationFilter('bar')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              stationFilter === 'bar'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🥤 บาร์เครื่องดื่ม
          </button>
        </div>
      </div>

      {/* Kitchen Orders Grid */}
      {pendingOrPreparingOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-3 shadow-xs">
          <UtensilsCrossed className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-700 text-base">ไม่มีออเดอร์รอดำเนินการในขณะนี้</h4>
          <p className="text-xs text-slate-500">ออเดอร์ใหม่จากหน้า POS จะแสดงบนจอนี้ทันที</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingOrPreparingOrders.map((order) => {
            const filteredItems = order.items.filter(
              (i) => stationFilter === 'all' || i.station === stationFilter
            );

            if (filteredItems.length === 0) return null;

            return (
              <div
                key={order.id}
                className={`border rounded-2xl p-4 space-y-3 shadow-xs transition-all duration-300 ${getStatusColor(
                  order.overallStatus
                )}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div>
                    <span className="font-mono font-extrabold text-base text-slate-900">
                      {order.orderNo}
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {order.orderType === 'dine_in'
                        ? `โต๊ะ: ${order.tableNo}`
                        : order.orderType === 'takeaway'
                        ? 'กลับบ้าน'
                        : 'เดลิเวอรี่'}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 font-mono shadow-2xs">
                    {getStatusText(order.overallStatus)}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2 py-1">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {item.productName} <span className="text-orange-600 font-mono font-extrabold">×{item.quantity}</span>
                        </p>
                        {item.customNotes && (
                          <p className="text-[10px] text-amber-700 italic font-medium">
                            หมายเหตุ: {item.customNotes}
                          </p>
                        )}
                      </div>

                      {/* Status Buttons */}
                      <div className="flex space-x-1">
                        {item.status === 'pending' && (
                          <button
                            onClick={() =>
                              updateKitchenItemStatus(order.id, item.id, 'preparing')
                            }
                            className="bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow-2xs"
                          >
                            [กำลังทำ]
                          </button>
                        )}
                        {item.status === 'preparing' && (
                          <button
                            onClick={() =>
                              updateKitchenItemStatus(order.id, item.id, 'ready')
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow-2xs"
                          >
                            [เสร็จแล้ว]
                          </button>
                        )}
                        {item.status === 'ready' && (
                          <button
                            onClick={() =>
                              updateKitchenItemStatus(order.id, item.id, 'served')
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow-2xs"
                          >
                            [เสิร์ฟแล้ว]
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Time */}
                <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.timestamp).toLocaleTimeString('th-TH')}
                  </span>
                  <span className="font-medium">{filteredItems.length} รายการ</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
