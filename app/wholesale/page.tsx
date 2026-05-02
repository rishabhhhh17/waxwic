import Link from 'next/link';

export const metadata = { title: 'Wholesale — Waxwic' };

export default function WholesalePage() {
  return (
    <section className="bg-cream py-16 md:py-24 min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-[12px] uppercase tracking-widest text-clay">For stockists</div>
        <h1 className="font-display text-5xl md:text-6xl text-ink mt-3 leading-tight">
          Stock Waxwic.
        </h1>
        <p className="mt-6 text-ink/80 max-w-prose leading-relaxed">
          Concept stores, hotel boutiques, perfume bars &mdash; if you sell things that sit nicely on a shelf, we&rsquo;d like you to consider us. Minimum order 30 tins, mix-and-match across the six fragrances. Standard wholesale margin starts at 50%.
        </p>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          <Card num="01" title="Reach out" body="Email wholesale@waxwic.in with your store name, location, and a sentence on what else you stock." />
          <Card num="02" title="We send a deck" body="Within 24 hours we&rsquo;ll send the wholesale price list and a digital lookbook." />
          <Card num="03" title="First order ships" body="Lead time is 10 working days for the first order; 5 days on repeats." />
        </div>
        <div className="mt-12">
          <Link
            href="mailto:wholesale@waxwic.in"
            className="inline-flex items-center h-12 px-7 bg-ink text-ivory text-[12px] uppercase tracking-wider"
          >
            Email wholesale@waxwic.in
          </Link>
        </div>
      </div>
    </section>
  );
}

function Card({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="bg-ivory p-6">
      <div className="text-xs uppercase tracking-widest text-clay">{num}</div>
      <div className="font-display text-2xl mt-2">{title}</div>
      <p className="mt-2 text-sm text-ink/75 leading-relaxed">{body}</p>
    </div>
  );
}
