/** Скелетон только колонки выдачи — при смене фильтров боковая панель остаётся на месте. */
export function CatalogResultsAreaFallback() {
  return (
    <div className="mt-2 min-w-0 w-full flex-1" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-neutral-200 lg:w-56" />
      </div>
      <div className="mt-4 h-[50px] animate-pulse rounded-[10px] bg-white shadow-sm" />

      <div className="mt-6 hidden lg:block">
        <div className="flex min-h-[280px] flex-col rounded-lg bg-white/90 shadow-sm">
          <div className="flex h-12 items-center gap-2 border-b border-neutral-100 px-6">
            <div
              className="size-5 shrink-0 animate-spin rounded-full border-2 border-brand/25 border-t-brand"
              role="status"
              aria-label="Загрузка"
            />
            <span className="text-sm text-[#4a5565]">Загрузка результатов…</span>
          </div>
          <div className="animate-pulse space-y-0 divide-y divide-neutral-100 px-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-4 py-4">
                <div className="h-4 flex-1 rounded bg-neutral-100" />
                <div className="h-4 w-24 rounded bg-neutral-100" />
                <div className="h-4 w-20 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 lg:hidden">
        <div
          className="size-9 shrink-0 animate-spin rounded-full border-2 border-brand/25 border-t-brand"
          role="status"
          aria-label="Загрузка результатов"
        />
        <p className="text-sm text-[#4a5565]">Загрузка результатов…</p>
      </div>
    </div>
  );
}
