export const metadata = { title: 'Shipping & returns — Waxwic' };

export default function ShippingPage() {
  return (
    <section className="bg-ivory py-16 md:py-24 min-h-[60vh]">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <h1 className="font-display text-5xl text-ink leading-tight">Shipping &amp; returns</h1>
        <div className="mt-8 space-y-8 text-ink/80 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ink">Shipping</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>· Free shipping inside India on orders over &#8377;999.</li>
              <li>· Flat &#8377;79 below &#8377;999.</li>
              <li>· Orders ship within 2 working days. Metros usually arrive in 3 days; rest of India 5–7.</li>
              <li>· We use BlueDart and Delhivery. Email <a href="mailto:hello@waxwic.in" className="underline decoration-clay underline-offset-4">hello@waxwic.in</a> with your order ID for tracking.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">Returns &amp; exchanges</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>· If a scent doesn&rsquo;t suit your skin, you can swap it within 14 days of delivery.</li>
              <li>· The tin must be at least 80% full and in its original sleeve.</li>
              <li>· Email <a href="mailto:hello@waxwic.in" className="underline decoration-clay underline-offset-4">hello@waxwic.in</a> with the order ID and a photo of the tin to start an exchange.</li>
              <li>· Damaged in transit? Email us within 48 hours of delivery — we&rsquo;ll re-ship at our cost.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">International</h2>
            <p className="mt-3 text-sm">Not yet — we&rsquo;re working on it. Drop us a line if you&rsquo;d like to be told when it&rsquo;s live.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
