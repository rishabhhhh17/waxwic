export const metadata = { title: 'Terms — Waxwic' };

export default function TermsPage() {
  return (
    <section className="bg-ivory py-16 md:py-24 min-h-[60vh]">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <h1 className="font-display text-5xl text-ink leading-tight">Terms</h1>
        <div className="mt-8 space-y-6 text-ink/80 leading-relaxed text-sm">
          <p>
            By placing an order on waxwic.in you agree to the points below. Plain language; if anything is unclear, write to us.
          </p>
          <div>
            <h2 className="font-display text-xl text-ink">Pricing &amp; availability</h2>
            <p className="mt-2">
              Prices are in Indian Rupees and include GST. We reserve the right to correct pricing errors before dispatch and to limit quantities on small batches.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Skin sensitivity</h2>
            <p className="mt-2">
              Solid perfumes use IFRA-compliant fragrance oils on a beeswax-jojoba base. Patch test on the inside of your wrist if you have known sensitivities. Discontinue use if irritation occurs.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Liability</h2>
            <p className="mt-2">
              Our liability for any single order is capped at the amount you paid for that order. We are not liable for lost custom shipments after they leave our courier&rsquo;s scan; we will help you chase tracking, but the courier&rsquo;s policy applies.
            </p>
          </div>
          <p className="text-xs text-smoke">Last updated: May 2026.</p>
        </div>
      </div>
    </section>
  );
}
