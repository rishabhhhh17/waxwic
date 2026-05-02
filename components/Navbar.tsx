'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const itemCount = useCart((s) => s.itemCount());
  const open = useCart((s) => s.open);
  const [hydrated, setHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-200',
        scrolled ? 'bg-ivory/95 backdrop-blur border-b border-line' : 'bg-ivory border-b border-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
        <button
          aria-label="Open menu"
          className="md:hidden -ml-2 p-2 text-ink"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase text-ink/80">
          <Link href="/products" className="hover:text-ink transition-colors">Shop</Link>
          <Link href="/products?category=woody" className="hover:text-ink transition-colors">Woody</Link>
          <Link href="/products?category=floral" className="hover:text-ink transition-colors">Floral</Link>
          <Link href="/about" className="hover:text-ink transition-colors">About</Link>
        </nav>

        <Link href="/" className="font-display text-2xl tracking-widest text-ink leading-none">
          waxwic
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="hidden md:inline-flex items-center justify-center h-9 px-4 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90 transition-colors"
          >
            Shop now
          </Link>
          <button
            onClick={open}
            aria-label="Open cart"
            className="relative p-2 text-ink hover:text-clay transition-colors"
          >
            <ShoppingBag size={20} />
            {hydrated && itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-clay text-ivory text-[10px] font-medium leading-none rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-ivory">
          <div className="px-5 h-16 flex items-center justify-between border-b border-line">
            <span className="font-display text-2xl tracking-widest">waxwic</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2">
              <X size={20} />
            </button>
          </div>
          <nav className="px-5 py-8 flex flex-col gap-5 text-2xl font-display">
            <Link href="/products" onClick={() => setMobileOpen(false)}>Shop all</Link>
            <Link href="/products?category=woody" onClick={() => setMobileOpen(false)}>Woody</Link>
            <Link href="/products?category=floral" onClick={() => setMobileOpen(false)}>Floral</Link>
            <Link href="/products?category=fresh" onClick={() => setMobileOpen(false)}>Fresh</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/wholesale" onClick={() => setMobileOpen(false)}>Wholesale</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
          </nav>
          <div className="px-5">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-12 px-6 bg-ink text-ivory text-sm uppercase tracking-wider w-full"
            >
              Shop now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
