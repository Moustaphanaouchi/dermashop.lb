'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin() {
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush/30">
      <div className="bg-white p-8 rounded-2xl shadow-luxe w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center">Admin Login</h1>
        <input
          className="w-full border rounded-lg p-3 mb-3 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-3 mb-4 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button onClick={handleLogin} className="w-full bg-maroon text-white py-3 rounded-lg font-semibold">
          Login
        </button>
      </div>
    </div>
  );
}