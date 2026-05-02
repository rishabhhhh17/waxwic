import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Marquee } from '@/components/Marquee';
import { getFeaturedProducts } from '@/lib/products';

export default function HomePage() {
  const featured = getFeaturedProducts(4);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-cream">
        <div className="mx-auto max-w-6xl px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="animate-fade-up">
            <div className="text-[12px] uppercase tracking-widest text-clay font-medium">
              Solid · Wax-based · Alcohol-free
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-ink leading-[0.95] mt-5">
              Perfume that travels<br />in your pocket.
            </h1>
            <p className="mt-6 text-base md:text-lg text-ink/80 max-w-prose leading-relaxed">
              Six fragrances, each hand-poured into a brass tin. No spray, no spill, no airport
              hassle — just press a fingertip in and dab where you want it to land.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 h-12 px-7 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90 transition-colors"
              >
                Shop the six <ArrowRight size={14} />
              </Link>
              <Link
                href="#mission"
                className="inline-flex items-center h-12 px-7 border border-ink/20 text-ink text-[12px] uppercase tracking-wider hover:border-ink transition-colors"
              >
                Why solid?
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-ink/70">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={14} className="fill-clay text-clay" />
                  ))}
                </div>
                <span className="tabular-nums">4.8 / 5</span>
              </div>
              <span className="text-line">|</span>
              <span>848 reviews</span>
            </div>
          </div>
          <div className="relative aspect-[4/5] md:aspect-[5/6] bg-line overflow-hidden order-first md:order-last">
            <Image
              src="/images/hero.jpg"
              alt="Waxwic solid perfume tin photographed on linen"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee
        items={[
          'Hand-poured in India',
          'Travel-safe — TSA approved',
          '8–12 hour wear',
          'Alcohol-free',
          'Refillable brass tins',
          'Cruelty free',
        ]}
      />

      {/* Social proof */}
      <section className="bg-ivory py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          <div>
            <div className="font-display text-3xl md:text-4xl text-ink">14k+</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-smoke">Tins poured</div>
          </div>
          <div>
            <div className="font-display text-3xl md:text-4xl text-ink">6</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-smoke">Signature scents</div>
          </div>
          <div>
            <div className="font-display text-3xl md:text-4xl text-ink">0%</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-smoke">Alcohol &amp; parabens</div>
          </div>
          <div>
            <div className="font-display text-3xl md:text-4xl text-ink">9 hr</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-smoke">Average wear</div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-ivory pt-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-[12px] uppercase tracking-widest text-clay">The collection</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink mt-2">Six scents to live in.</h2>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-sm text-ink hover:text-clay"
            >
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-12 px-7 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90 transition-colors"
            >
              Shop all six <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative aspect-[4/5] bg-line overflow-hidden">
            <Image
              src="/images/lifestyle-1.jpg"
              alt="Waxwic perfume tins arranged on a tray"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-widest text-clay">Why we made these</div>
            <h2 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-tight">
              A scent shouldn&rsquo;t shout to be felt.
            </h2>
            <div className="mt-6 space-y-4 text-ink/80 leading-relaxed">
              <p>
                Sprays sit on cloth and fight perfume oil for skin contact. Solid perfume goes the other
                way: a beeswax-and-jojoba balm warmed by your fingertip, dabbed straight onto the wrist
                or behind the ear. Closer to the skin. Quieter sillage. Lasts longer than people expect.
              </p>
              <p>
                Every tin is poured by hand in batches of 80. Six fragrances — woody, floral, fresh, smoky.
                Pick one that fits the day; the brass tin slides into a coin pocket.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 h-12 px-7 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90"
            >
              Try a tin
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink text-ivory py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Find the one that smells like you.
          </h2>
          <p className="mt-5 text-ivory/75 max-w-prose mx-auto">
            Six tins, six personalities. Free shipping over &#8377;999. If a scent doesn&rsquo;t suit
            your skin, send it back inside 14 days &mdash; we&rsquo;ll swap it.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 h-12 px-8 bg-ember text-ink text-[12px] uppercase tracking-wider hover:bg-ember/90"
          >
            Shop perfumes <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
