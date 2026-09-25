'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '../page';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch('/api/admin/orders');
    setOrders(await res.json());
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AdminNav />
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">{o.customerName}</p>
                  <p className="text-sm text-zinc-500">{o.phone} · {o.address}</p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-sm text-zinc-600 mb-2">
                {(typeof o.items === 'string' ? JSON.parse(o.items) : o.items).map((it: any, i: number, arr: any[]) => (
                  <span key={i}>{it.name} × {it.quantity}{i < arr.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
              <p className="text-sm">
                Subtotal ${o.subtotal.toFixed(2)} · Delivery ${o.deliveryFee.toFixed(2)} · Discount ${o.discount.toFixed(2)} ·
                <strong> Total ${o.total.toFixed(2)}</strong> · {o.paymentMethod}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}