'use client';
import { AdminNav } from '@/components/AdminNav';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';


const EMPTY: any = { name: '', category: 'skin', price: 0, bulkPrice: '', bulkQty: '', stock: true, badge: '', description: '', media: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUri: reader.result }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          const mediaType = file.type.startsWith('video') ? 'video' : 'image';
          setForm((f: any) => ({
            ...f,
            media: [...f.media, { type: mediaType, url: data.url }],
          }));
        } else {
          alert(data.error || 'Upload failed');
        }
      } catch {
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveProduct() {
    const payload = {
      ...form,
      price: Number(form.price),
      bulkPrice: form.bulkPrice ? Number(form.bulkPrice) : null,
      bulkQty: form.bulkQty ? Number(form.bulkQty) : null,
    };

    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm(EMPTY);
      setEditingId(null);
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to save');
    }
  }

  function editProduct(p: any) {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      bulkPrice: p.bulkPrice || '',
      bulkQty: p.bulkQty || '',
      stock: p.stock,
      badge: p.badge || '',
      description: p.description || '',
      media: p.media.map((m: any) => ({ type: m.type, url: m.url })),
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product permanently?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-5xl mx-auto">
        <AdminNav />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            onClick={() => { setForm(EMPTY); setEditingId(null); setShowForm(true); }}
            className="bg-maroon text-white px-5 py-2 rounded-full font-semibold"
          >
            + New Product
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-luxe space-y-3">
            <input className="w-full border rounded-lg p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="border rounded-lg p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="serums">Serums</option>
                <option value="skin">Skin</option>
                <option value="hair">Hair</option>
                <option value="tools">Tools</option>
              </select>
              <input className="border rounded-lg p-2" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input className="border rounded-lg p-2" type="number" placeholder="Bulk price (optional)" value={form.bulkPrice} onChange={(e) => setForm({ ...form, bulkPrice: e.target.value })} />
              <input className="border rounded-lg p-2" type="number" placeholder="Bulk qty (optional)" value={form.bulkQty} onChange={(e) => setForm({ ...form, bulkQty: e.target.value })} />
            </div>
            <input className="w-full border rounded-lg p-2" placeholder="Badge (e.g. Best Seller)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            <textarea className="w-full border rounded-lg p-2" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.checked })} />
              In stock
            </label>

            <div>
              <p className="text-sm font-semibold mb-2">Photos / Videos</p>
              <input type="file" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} disabled={uploading} />
              {uploading && <p className="text-xs text-zinc-400 mt-1">Uploading...</p>}
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.media.map((m: any, i: number) => (
                  <div key={i} className="relative">
                    {m.type === 'video' ? (
                      <video src={m.url} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <img src={m.url} className="w-16 h-16 object-cover rounded" />
                    )}
                    <button
                      onClick={() => setForm({ ...form, media: form.media.filter((_: any, idx: number) => idx !== i) })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={saveProduct} className="bg-maroon text-white px-5 py-2 rounded-full font-semibold">
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full border">Cancel</button>
            </div>
          </div>
        )}

        \
        <div className="grid ...">
          {products.map((p: any) => (
             ...
          ))}
        </div>
      </div>
    </div><div className="grid sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-4 shadow flex justify-between items-start">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-zinc-500">${p.price} · {p.category} · {p.stock ? 'In stock' : 'Out of stock'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editProduct(p)} className="text-blue-600 text-sm">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}