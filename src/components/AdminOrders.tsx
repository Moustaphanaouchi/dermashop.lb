'use client';

import React, { useEffect, useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  }

  function exportCSV() {
    if (!orders.length) return;
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Address', 'Total ($)', 'Status'];
    const rows = orders.map((o) => [
      o.id.slice(0, 8),
      new Date(o.createdAt || o.created_at).toLocaleDateString(),
      `"${(o.customerName || o.customer_name || '').replace(/"/g, '""')}"`,
      o.phone || o.customer_phone || '',
      `"${(o.address || '').replace(/"/g, '""')}"`,
      o.total,
      o.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `dermashop_orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const displayedOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">📦 Customer Orders</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Track and manage Lebanese deliveries</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-zinc-200 rounded-xl px-3 py-2 bg-white"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <span>Export CSV</span>
            <span>📥</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400 text-sm">Loading orders...</div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 text-sm">No orders found.</div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-stone-50 text-zinc-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Location</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {displayedOrders.map((o) => {
                const customerName = o.customerName || o.customer_name || 'Customer';
                const phone = o.phone || o.customer_phone || '';
                const itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;

                return (
                  <tr key={o.id} className="hover:bg-rose-50/20">
                    <td className="p-3">
                      <div className="font-bold text-zinc-900">{customerName}</div>
                      {phone && (
                        <a
                          href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline"
                        >
                          {phone} 💬
                        </a>
                      )}
                    </td>
                    <td className="p-3 max-w-[200px]">
                      <div className="text-[11px] text-zinc-600 truncate">{o.address}</div>
                    </td>
                    <td className="p-3">
                      <ul className="space-y-0.5">
                        {Array.isArray(itemsList) &&
                          itemsList.map((it: any, idx: number) => (
                            <li key={idx} className="text-[11px]">
                              {it.quantity}x {it.name}
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-zinc-900">${Number(o.total).toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-400 uppercase">
                        {o.paymentMethod || o.payment_method}
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status || 'pending'}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`text-[11px] font-semibold border rounded-lg px-2 py-1 ${
                          STATUS_COLORS[o.status] || 'bg-zinc-100'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-[10px] text-zinc-400 block">
                        {new Date(o.createdAt || o.created_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}