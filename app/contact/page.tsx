export const metadata = { title: 'Contact — Waxwic' };

export default function ContactPage() {
  return (
    <section className="bg-ivory py-16 md:py-24 min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-[12px] uppercase tracking-widest text-clay">Get in touch</div>
        <h1 className="font-display text-5xl md:text-6xl text-ink mt-3 leading-tight">Talk to us.</h1>
        <div className="mt-10 grid sm:grid-cols-2 gap-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-smoke mb-2">Order help</div>
            <a href="mailto:hello@waxwic.in" className="text-lg text-ink underline decoration-clay underline-offset-4">
              hello@waxwic.in
            </a>
            <p className="mt-2 text-sm text-smoke">We reply within 24 hours, weekends excepted.</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-smoke mb-2">Wholesale &amp; press</div>
            <a href="mailto:wholesale@waxwic.in" className="text-lg text-ink underline decoration-clay underline-offset-4">
              wholesale@waxwic.in
            </a>
            <p className="mt-2 text-sm text-smoke">Min. order 30 tins. We&rsquo;ll send a deck and price list.</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-smoke mb-2">Studio</div>
            <p className="text-sm text-ink/80 leading-relaxed">
              No. 14, 1st Cross, Indiranagar,<br />Bengaluru 560038, India
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-smoke mb-2">Hours</div>
            <p className="text-sm text-ink/80 leading-relaxed">
              Mon–Sat &middot; 10am – 6pm IST
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
