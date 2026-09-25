import Link from 'next/link';

export function AdminNav() {
  return (
    <nav className="flex items-center gap-6 mb-8 pb-4 border-b border-zinc-200">
      <Link
        href="/admin"
        className="text-sm font-medium hover:text-black transition-colors"
      >
        Products
      </Link>
      <Link
        href="/admin/orders"
        className="text-sm font-medium hover:text-black transition-colors"
      >
        Orders
      </Link>
      <Link
        href="/admin/coupons"
        className="text-sm font-medium hover:text-black transition-colors"
      >
        Coupons
      </Link>
    </nav>
  );
}

export default AdminNav;