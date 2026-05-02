export function AnnouncementBar() {
  return (
    <div className="bg-clay text-ivory text-center text-[12px] uppercase tracking-widest px-4 py-2 leading-tight">
      <span className="hidden sm:inline">First tin? </span>
      <span>Take 15% off — code </span>
      <span className="font-medium underline decoration-ivory/60 underline-offset-4">WAX15</span>
      <span className="hidden sm:inline"> at checkout.</span>
    </div>
  );
}
