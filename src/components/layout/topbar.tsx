export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Sprint 00</p>
          <p className="font-semibold">Foundation Skeleton</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Owner placeholder</div>
      </div>
    </header>
  );
}
