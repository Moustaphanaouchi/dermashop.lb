import Link from 'next/link';

export const metadata = {
  title: 'About Us | Dermashop LB',
  description: 'Authentic clinical skin and hair care solutions delivered across Lebanon.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs space-y-8">
        <div>
          <Link href="/" className="text-xs font-semibold text-rose-700 hover:underline">
            ← Back to Store
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-3">
            About Dermashop LB
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Clinical Care. Authentic Formulas. Fast Local Delivery.
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-600">
          <p>
            Welcome to <strong className="text-zinc-900">Dermashop LB</strong>. We are a specialized Lebanese retailer focused exclusively on verified, high-performance hair and skincare treatments designed to deliver real dermatological results.
          </p>
          <p>
            In a market filled with counterfeit or improperly stored cosmetics, we prioritize product integrity above all else. Every item in our catalog is guaranteed 100% original, imported through certified channels, and maintained in temperature-regulated facilities to ensure active clinical ingredients remain effective.
          </p>
        </section>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <div className="text-xl mb-1">🛡️</div>
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wide">100% Authentic</h3>
            <p className="text-xs text-zinc-500 mt-1">Directly sourced, original clinical formulas only.</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <div className="text-xl mb-1">🚚</div>
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wide">Lebanon-Wide</h3>
            <p className="text-xs text-zinc-500 mt-1">Express delivery to Beirut, North, South, and Bekaa.</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <div className="text-xl mb-1">💬</div>
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wide">Dedicated Support</h3>
            <p className="text-xs text-zinc-500 mt-1">Direct consultation and order tracking via WhatsApp.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Need personalized product guidance?</span>
          <a
            href="https://wa.me/96170000000" // Replace with your real WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Chat with us on WhatsApp →
          </a>
        </div>
      </div>
    </main>
  );
}