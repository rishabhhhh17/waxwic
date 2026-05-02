export const metadata = { title: 'Privacy — Waxwic' };

export default function PrivacyPage() {
  return (
    <section className="bg-ivory py-16 md:py-24 min-h-[60vh]">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <h1 className="font-display text-5xl text-ink leading-tight">Privacy</h1>
        <div className="mt-8 space-y-6 text-ink/80 leading-relaxed text-sm">
          <p>
            We collect only what we need to ship your order and keep our books straight: your name, email, phone, and shipping address. We do not sell or rent this data, ever.
          </p>
          <div>
            <h2 className="font-display text-xl text-ink">Payments</h2>
            <p className="mt-2">
              All payments are processed by Razorpay. We never see your card or UPI credentials &mdash; only the success or failure signal and a payment ID.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Analytics &amp; ads</h2>
            <p className="mt-2">
              We use the Meta Pixel to measure how our advertising is working. This means an anonymous record of pages you visit on this site is shared with Meta. You can opt out by blocking trackers in your browser; the site will still work.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Your rights</h2>
            <p className="mt-2">
              Email <a href="mailto:hello@waxwic.in" className="underline decoration-clay underline-offset-4">hello@waxwic.in</a> any time to ask what we hold on you, correct it, or delete it.
            </p>
          </div>
          <p className="text-xs text-smoke">Last updated: May 2026.</p>
        </div>
      </div>
    </section>
  );
}
