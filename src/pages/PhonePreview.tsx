const PhonePreview = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
        <section className="max-w-md space-y-4 text-center lg:pt-24 lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80">Phone Preview</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ensuring your medications work in <span className="text-gradient">harmony</span>
          </h1>
          <p className="text-base leading-7 text-slate-300 sm:text-lg">
            This view mirrors the live homepage, so any landing-page changes show up here automatically. It is great for
            checking spacing, typography, and screenshot-friendly compositions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 lg:justify-start">
            <a
              href="/"
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold transition hover:bg-white/15"
            >
              Open full page
            </a>
            <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 font-medium text-sky-100">
              iPhone 14 Pro proportions
            </span>
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-[4.5rem] bg-cyan-400/20 blur-3xl" />
          <div className="relative mx-auto h-[820px] w-[400px] rounded-[4.5rem] border border-white/10 bg-neutral-950 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.65)]">
            <div className="relative h-full w-full overflow-hidden rounded-[3.6rem] border border-white/10 bg-white">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/8 to-transparent" />
              <div className="pointer-events-none absolute left-1/2 top-3 z-20 flex h-9 w-40 -translate-x-1/2 items-center justify-between rounded-full border border-white/5 bg-black px-4 shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                <span className="h-3 w-3 rounded-full bg-neutral-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-900 ring-1 ring-sky-300/10" />
              </div>
              <iframe
                title="HarmoniMed landing page preview"
                src="/?phone-preview=1"
                className="absolute inset-0 h-full w-full bg-white"
              />
            </div>
            <div className="pointer-events-none absolute -right-[3px] top-36 h-20 w-1 rounded-full bg-white/20" />
            <div className="pointer-events-none absolute -left-[3px] top-28 h-12 w-1 rounded-full bg-white/20" />
            <div className="pointer-events-none absolute -left-[3px] top-44 h-24 w-1 rounded-full bg-white/20" />
          </div>
        </section>
      </div>
    </main>
  );
};

export default PhonePreview;
