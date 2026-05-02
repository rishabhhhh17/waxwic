import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink text-ivory mt-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-3xl tracking-widest">waxwic</div>
            <p className="mt-4 text-ivory/70 text-sm leading-relaxed max-w-xs">
              Solid perfumes hand-poured in small batches. Wax-based, alcohol-free, made to travel close to the skin.
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-widest text-ivory/60 mb-4">Shop</div>
            <ul className="space-y-2.5 text-sm text-ivory/85">
              <li><Link href="/products" className="hover:text-ember">All perfumes</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-widest text-ivory/60 mb-4">Customer care</div>
            <ul className="space-y-2.5 text-sm text-ivory/85">
              <li><Link href="/contact" className="hover:text-ember">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-ember">Shipping &amp; returns</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-widest text-ivory/60 mb-4">Company</div>
            <ul className="space-y-2.5 text-sm text-ivory/85">
              <li><Link href="/about" className="hover:text-ember">Our story</Link></li>
              <li><Link href="/wholesale" className="hover:text-ember">Wholesale</Link></li>
              <li><Link href="/privacy" className="hover:text-ember">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-ember">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-ivory/15 flex flex-col md:flex-row justify-between text-xs text-ivory/55 gap-2">
          <span>&copy; {new Date().getFullYear()} Waxwic. All rights reserved.</span>
          <span>Hand-poured in India.</span>
        </div>
      </div>
    </footer>
  );
}
