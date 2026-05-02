export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-cream border-y border-line">
      <div className="flex gap-12 py-4 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="text-[12px] uppercase tracking-widest text-ink/70 font-sans inline-flex items-center gap-12"
          >
            {it}
            <span className="text-clay">&middot;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
