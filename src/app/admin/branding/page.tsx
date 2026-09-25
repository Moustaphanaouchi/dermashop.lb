'use client';

import { useEffect, useState } from 'react';
import { AdminNav } from '@/components/AdminNav';

export default function AdminBranding() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/branding').then((r) => r.json()).then((d) => setLogoUrl(d.logoUrl));
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUri: reader.result }),
      });
      const uploadData = await uploadRes.json();
      if (uploadRes.ok) {
        await fetch('/api/admin/branding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logoUrl: uploadData.url }),
        });
        setLogoUrl(uploadData.url);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  async function removeLogo() {
    await fetch('/api/admin/branding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl: null }),
    });
    setLogoUrl(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-md mx-auto">
        <AdminNav />
        <h1 className="text-2xl font-bold mb-6">Branding</h1>
        <div className="bg-white rounded-2xl p-6 shadow-luxe text-center">
          {logoUrl ? (
            <img src={logoUrl} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blush mx-auto mb-4 flex items-center justify-center text-3xl">💄</div>
          )}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={uploading} />
          {logoUrl && (
            <button onClick={removeLogo} className="block mx-auto mt-4 text-red-600 text-sm">Remove Logo</button>
          )}
        </div>
      </div>
    </div>
  );
}