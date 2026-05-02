import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-cream">
      <div className="max-w-md text-center px-5">
        <div className="font-display text-7xl text-ink leading-none">404</div>
        <p className="mt-4 text-ink/70">
          We couldn&rsquo;t find that scent. Maybe try the full collection.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center justify-center h-11 px-6 bg-ink text-ivory text-[12px] uppercase tracking-wider"
        >
          Shop perfumes
        </Link>
      </div>
    </section>
  );
}
