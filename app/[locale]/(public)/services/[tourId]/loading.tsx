export default function Loading() {
  return (
    <div className="bg-white">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="grid auto-rows-[180px] gap-4 rounded-3xl bg-white/10 p-4 shadow-xl sm:p-6 lg:grid-cols-2 animate-pulse">
              <div className="col-span-2 row-span-2 min-h-[260px] rounded-2xl bg-white/10" />
              <div className="rounded-2xl bg-white/10" />
              <div className="rounded-2xl bg-white/10" />
            </div>
            <div className="space-y-4 animate-pulse">
              <div className="h-3 w-32 rounded-full bg-white/20" />
              <div className="h-8 w-3/4 rounded-full bg-white/20" />
              <div className="h-4 w-2/3 rounded-full bg-white/20" />
              <div className="h-4 w-1/2 rounded-full bg-white/20" />
              <div className="h-10 w-40 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-11/12 rounded-full bg-slate-200" />
            <div className="h-4 w-10/12 rounded-full bg-slate-200" />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 animate-pulse">
            <div className="h-6 w-32 rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-52 rounded-full bg-slate-200" />
            <div className="mt-6 h-8 w-40 rounded-full bg-slate-200" />
            <div className="mt-2 h-4 w-20 rounded-full bg-slate-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-44 rounded-full bg-slate-200" />
              <div className="h-4 w-36 rounded-full bg-slate-200" />
            </div>
            <div className="mt-6 h-11 w-full rounded-2xl bg-slate-200" />
            <div className="mt-2 h-11 w-full rounded-2xl bg-slate-200" />
          </div>
        </div>
      </section>
    </div>
  );
}
