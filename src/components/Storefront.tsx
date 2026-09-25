'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'serums', name: 'Serums' },
  { id: 'skin', name: 'Skin Care' },
  { id: 'hair', name: 'Hair Care' },
  { id: 'tools', name: 'Tools' },
];

export default function Storefront({ initialProducts, logoUrl }: { initialProducts: any[]; logoUrl: string | null }) {
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState('all');

  function addToCart(id: string) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { id, quantity: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  const filteredProducts = category === 'all' ? products : products.filter((p) => p.category === category);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blush/30 via-white to-white">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Dermashop LB" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="text-2xl">💄</span>
            )}
            <div>
              <h1 className="font-bold text-lg">Dermashop LB</h1>
              <p className="text-xs text-zinc-500">Premium Hair & Skin Solutions</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative bg-maroon text-white px-4 py-2 rounded-full text-sm font-semibold">
            Cart {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <span className="inline-block bg-blush text-maroon text-xs font-semibold px-4 py-1 rounded-full mb-4">
          🌍 Worldwide Shipping Available
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Luxury Clinical <span className="text-maroon">Hair & Skin Care</span>
        </h2>
        <p className="text-zinc-600 max-w-xl mx-auto mb-6">
          Professional-grade formulations, delivered across all of Lebanon.
        </p>
        <p className="text-sm bg-yellow-50 border border-yellow-200 inline-block px-4 py-2 rounded-full mb-8">
          🎉 New here? Use code <strong>WELCOME10</strong> for 10% off your first order
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                category === c.id ? 'bg-maroon text-white border-maroon' : 'bg-white border-pink-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </section>

      <footer className="bg-zinc-900 text-white py-10 text-center text-sm">
        <p>📞 +961 3 448 482 &nbsp;·&nbsp; 💳 Cash on Delivery or WishPay</p>
        <p className="mt-2 text-zinc-400">🚚 Delivering to all regions of Lebanon</p>
        <p className="mt-4 text-zinc-500">&copy; {new Date().getFullYear()} Dermashop LB</p>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onOrderComplete={() => setCart([])}
      />
    </div>
  );
}