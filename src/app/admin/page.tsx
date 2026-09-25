'use client';
import { AdminNav } from '@/components/AdminNav';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import AdminOrders from '@/components/AdminOrders';

const EMPTY: any = {
  name: '',
  category: 'skin',
  price: 0,
  bulkPrice: '',
  bulkQty: '',
  stock: true,
  badge: '',
  description: '',
  media: [],
};

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

  // Compresses high-res iPhone photos so they never exceed Vercel's 4.5MB limit
  async function prepareDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('video')) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to universal web JPEG format at 80% quality (~350KB)
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(optimizedBase64);
        };

        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const dataUri = await prepareDataUri(file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUri }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setForm((f: any) => ({
          ...f,
          media: [
            ...f.media,
            {
              type: data.type || (file.type.startsWith('video') ? 'video' : 'image'),
              url: data.url,
            },
          ],
        }));
      } else {
        alert(data.error || 'Upload failed: file may be too large.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
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
      <div className="max-w-5xl mx-auto space-y-8">
        <AdminNav />

        {/* Product Catalog Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <button
              onClick={() => {
                setForm(EMPTY);
                setEditingId(null);
                setShowForm(true);
              }}
              className="bg-maroon text-white px-5 py-2 rounded-full font-semibold"
            >
              + New Product
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-luxe space-y-3">
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="border rounded-lg p-2"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="serums">Serums</option>
                  <option value="skin">Skin</option>
                  <option value="hair">Hair</option>
                  <option value="tools">Tools</option>
                </select>
                <input
                  className="border rounded-lg p-2"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                  className="border rounded-lg p-2"
                  type="number"
                  placeholder="Bulk price (optional)"
                  value={form.bulkPrice}
                  onChange={(e) => setForm({ ...form, bulkPrice: e.target.value })}
                />
                <input
                  className="border rounded-lg p-2"
                  type="number"
                  placeholder="Bulk qty (optional)"
                  value={form.bulkQty}
                  onChange={(e) => setForm({ ...form, bulkQty: e.target.value })}
                />
              </div>
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Badge (e.g. Best Seller)"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
              <textarea
                className="w-full border rounded-lg p-2"
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.checked })}
                />
                In stock
              </label>

              <div>
                <p className="text-sm font-semibold mb-2">Photos / Videos</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  disabled={uploading}
                />
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
                        onClick={() =>
                          setForm({
                            ...form,
                            media: form.media.filter((_: any, idx: number) => idx !== i),
                          })
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveProduct}
                  className="bg-maroon text-white px-5 py-2 rounded-full font-semibold"
                >
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-full border"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-4 shadow flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-zinc-500">
                    ${p.price} · {p.category} · {p.stock ? 'In stock' : 'Out of stock'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editProduct(p)} className="text-blue-600 text-sm">
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Tracker & Dispatch Management */}
        <AdminOrders />
      </div>
    </div>
  );
}