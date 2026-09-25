'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '../page';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [form, setForm] = useState({ code: '', percentOff: '', dollarOff: '', firstOrderOnly: false, active: true });

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch('/api/admin/coupons');
    setCoupons(await res.json());
  }

  async function create() {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        percentOff: form.percentOff ? Number(form.percentOff) : null,
        dollarOff: form.dollarOff ? Number(form.dollarOff) : null,
      }),
    });
    if (res.ok) {
      setForm({ code: '', percentOff: '', dollarOff: '', firstOrderOnly: false, active: true });
      load();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-3xl mx-auto">
        <AdminNav />
        <h1 className="text-2xl font-bold mb-6">Coupons</h1>

        <div className="bg-white rounded-2xl p-5 mb-6 shadow-luxe grid grid-cols-2 gap-3">
          <input className="border rounded-lg p-2 uppercase" placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <input className="border rounded-lg p-2" type="number" placeholder="% off" value={form.percentOff} onChange={(e) => setForm({ ...form, percentOff: e.target.value })} />
          <input className="border rounded-lg p-2" type="number" placeholder="$ off" value={form.dollarOff} onChange={(e) => setForm({ ...form, dollarOff: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })} />
            First order only
          </label>
          <button onClick={create} className="col-span-2 bg-maroon text-white py-2 rounded-lg font-semibold">Create Coupon</button>
        </div>

        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
              <div>
                <p className="font-bold">{c.code}</p>
                <p className="text-sm text-zinc-500">
                  {c.percentOff ? `${c.percentOff}% off` : ''} {c.dollarOff ? `$${c.dollarOff} off` : ''} {c.firstOrderOnly ? '· First order only' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(c.id, c.active)} className={`text-sm px-3 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => remove(c.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}