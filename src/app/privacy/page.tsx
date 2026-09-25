import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Dermashop LB',
  description: 'How Dermashop LB handles customer data and checkout privacy.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs space-y-6">
        <div>
          <Link href="/" className="text-xs font-semibold text-rose-700 hover:underline">
            ← Back to Store
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">1. Information We Collect</h2>
            <p>
              When placing an order on Dermashop LB, we collect minimal personal details required to fulfill and deliver your package: your full name, WhatsApp mobile number, delivery address (city, street, building), and preferred payment method.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">2. How We Use Your Data</h2>
            <p>Your details are used solely to:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Coordinate courier drop-offs and communicate arrival times via WhatsApp.</li>
              <li>Maintain your customer loyalty rewards balance linked to your mobile number.</li>
              <li>Provide digital order receipts and dispatch updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">3. Payment Security & Bank Cards</h2>
            <p>
              Dermashop LB does not process or store credit card numbers or banking passwords. Payments are settled strictly upon doorstep delivery (Cash on Delivery in USD/LBP) or through verified peer-to-peer transfers (Whish Money).
            </p>
          </section>

          <section>
            <h2 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">4. Third-Party Sharing</h2>
            <p>
              We never sell, rent, or disclose customer phone numbers or addresses to marketing agencies. Information is shared only with our trusted local Lebanese delivery couriers for the sole purpose of dropping off your order.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">5. Contact & Data Removal</h2>
            <p>
              If you wish to update your delivery address or request the removal of your customer order record, message our team directly via WhatsApp or email us at support@dermashoplb.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}