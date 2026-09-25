'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '@/components/AdminNav';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  }

  function parseItems(raw: any) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AdminNav />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <span className="text-sm text-zinc-500 font-medium">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-zinc-500 shadow-sm border border-zinc-100">
            No orders placed yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const items = parseItems(o.items);
              const subtotal = Number(o.subtotal || 0);
              const delivery = Number(o.deliveryFee || 0);
              const discount = Number(o.discount || 0);
              const total = Number(o.total || 0);

              return (
                <div key={o.id} className="bg-white rounded-xl p-5 shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <p className="font-bold text-base text-zinc-900">{o.customerName || 'Customer'}</p>
                      <p className="text-sm text-zinc-500">
                        {o.phone} · {o.address}
                      </p>
                    </div>
                    <select
                      value={o.status || 'pending'}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-zinc-50 focus:ring-1 focus:ring-black outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-sm text-zinc-700 bg-zinc-50 rounded-lg p-3 mb-3 border border-zinc-100">
                    {items.length > 0 ? (
                      items.map((it: any, i: number) => (
                        <span key={i} className="inline-block mr-2">
                          <strong className="text-zinc-900">{it.name}</strong> × {it.quantity}
                          {i < items.length - 1 ? ',' : ''}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400 italic">No line items recorded</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 gap-2">
                    <div>
                      Subtotal: ${subtotal.toFixed(2)} · Delivery: ${delivery.toFixed(2)}
                      {discount > 0 && ` · Discount: -$${discount.toFixed(2)}`}
                      <span className="ml-2 font-bold text-zinc-900 text-sm">
                        Total: ${total.toFixed(2)}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800 uppercase">
                        {o.paymentMethod === 'wishpay' ? 'Whish Money' : 'Cash'}
                      </span>
                    </div>
                    <span>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}