import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About — Waxwic',
  description: 'How we make wax-based solid perfumes, in small batches, in India.',
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="text-[12px] uppercase tracking-widest text-clay">Our story</div>
          <h1 className="font-display text-5xl md:text-6xl text-ink mt-3 leading-[1.05]">
            We started with one tin in a coat pocket.
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            Two friends, a winter in the Himalayas, and a frustration with sprays that kept fighting our jackets for the perfume oil. We wanted something that sat on the skin instead of the cloth — close, quiet, and lasting.
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] bg-line overflow-hidden">
            <Image src="/images/lifestyle-2.jpg" alt="Waxwic perfume tin" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl">How a tin gets made.</h2>
            <ol className="mt-6 space-y-5 text-ink/80 leading-relaxed">
              <li>
                <div className="text-xs uppercase tracking-widest text-smoke">01</div>
                <div className="mt-1">A base of cosmetic-grade beeswax is melted with organic jojoba and fractionated coconut oil.</div>
              </li>
              <li>
                <div className="text-xs uppercase tracking-widest text-smoke">02</div>
                <div className="mt-1">We blend in IFRA-compliant fragrance oils to a precise weight ratio for skin safety.</div>
              </li>
              <li>
                <div className="text-xs uppercase tracking-widest text-smoke">03</div>
                <div className="mt-1">The mix is hand-poured into refillable brass tins and left to set for 6 hours.</div>
              </li>
              <li>
                <div className="text-xs uppercase tracking-widest text-smoke">04</div>
                <div className="mt-1">Each tin is hand-labelled, lot-stamped, and packed in a recycled-pulp sleeve.</div>
              </li>
            </ol>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center h-11 px-6 bg-ink text-ivory text-[12px] uppercase tracking-wider"
            >
              Shop the six
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
