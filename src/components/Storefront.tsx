'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';
import ProductDetailModal from './ProductDetailModal';
import { CatalogSearch } from '@/components/CatalogSearch';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'serums', label: 'Serums' },
  { id: 'skin', label: 'Skin Care' },
  { id: 'hair', label: 'Hair Care' },
  { id: 'tools', label: 'Tools' },
];

export default function Storefront({
  initialProducts,
  logoUrl,
}: {
  initialProducts: any[];
  logoUrl: string | null;
}) {
  const [products] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Updated to handle bulk/bundle quantities from the quick-view modal and product card
  function addToCart(id: string, quantityToAdd: number = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantityToAdd } : i
        );
      }
      return [...prev, { id, quantity: quantityToAdd }];
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

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blush/30 via-white to-white">
      {/* Header with Search Bar in between Logo and Cart */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-pink-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          {/* Top Line on Mobile, Single Flex Row on Desktop */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-2.5 shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Dermashop LB" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <img
                  src="/logo.png"
                  alt="Dermashop LB Logo"
                  className="w-9 h-9 rounded-full object-cover border border-rose-100 shadow-xs"
                />
              )}
              <div>
                <h1 className="font-bold text-sm sm:text-base leading-tight text-zinc-900">Dermashop LB</h1>
                <p className="text-[10px] text-zinc-400 hidden xs:block">Hair & Skin Solutions</p>
              </div>
            </div>

            {/* Desktop Center Search Bar (Hidden on Mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <CatalogSearch
                products={products}
                onFilter={setFilteredProducts}
                categories={CATEGORIES}
                activeCategory={category}
                onSelectCategory={setCategory}
              />
            </div>

            {/* Right: Cart Button */}
            <div className="shrink-0">
              <button
                onClick={() => setCartOpen(true)}
                className="relative bg-maroon text-white px-3.5 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-transform flex items-center gap-1.5 shadow-xs"
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-white text-maroon text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Bottom Search Bar (Visible only on Mobile) */}
          <div className="md:hidden mt-2 pt-1 border-t border-pink-50">
            <CatalogSearch
              products={products}
              onFilter={setFilteredProducts}
              categories={CATEGORIES}
              activeCategory={category}
              onSelectCategory={setCategory}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-14 pb-8 text-center">
        <span className="inline-block bg-blush text-maroon text-xs font-semibold px-4 py-1 rounded-full mb-4">
          🌍 Worldwide Shipping Available
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Luxury Clinical <span className="text-maroon">Hair & Skin Care</span>
        </h2>
        <p className="text-zinc-600 max-w-xl mx-auto mb-6">
          Professional-grade formulations, delivered across all of Lebanon.
        </p>
        <p className="text-sm bg-yellow-50 border border-yellow-200 inline-block px-4 py-2 rounded-full mb-6">
          🎉 New here? Use code <strong>WELCOME10</strong> for 10% off your first order
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold border transition ${
                category === c.id ? 'bg-maroon text-white border-maroon' : 'bg-white border-pink-200 text-zinc-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-base sm:text-lg mb-2">No matching products found.</p>
            <button
              onClick={() => setCategory('all')}
              className="text-xs text-maroon underline font-medium"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAdd={addToCart} 
                onQuickView={setSelectedProduct} 
              />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-zinc-900 text-white py-10 text-center text-sm">
        <p>📞 +961 3 448 482 &nbsp;·&nbsp; 💳 Cash on Delivery or WishPay</p>
        <p className="mt-2 text-zinc-400">🚚 Delivering to all regions of Lebanon</p>
        <p className="mt-4 text-zinc-500">&copy; {new Date().getFullYear()} Dermashop LB</p>
      </footer>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />

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