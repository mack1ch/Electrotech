import type { ApiProductSpecification } from '@/lib/types/catalog';

function SpecColumn({ rows }: { rows: ApiProductSpecification[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4 text-base">
            <span className="shrink-0 text-[#6a7282]">{row.label}</span>
            <span className="text-right font-semibold text-ink">{row.value}</span>
          </div>
          <div className="h-px w-full bg-[#e5e5e5]" aria-hidden />
        </div>
      ))}
    </div>
  );
}

export function ProductSpecifications({ specs }: { specs: ApiProductSpecification[] }) {
  if (specs.length === 0) {
    return null;
  }
  const mid = Math.ceil(specs.length / 2);
  const left = specs.slice(0, mid);
  const right = specs.slice(mid);

  return (
    <section className="rounded-lg bg-white px-6 pb-6 pt-8 shadow-sm lg:pb-4">
      <h2 className="text-lg font-semibold leading-normal text-ink lg:text-[21px]">
        Технические характеристики
      </h2>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-x-[46px] lg:gap-y-0">
        <SpecColumn rows={left} />
        <SpecColumn rows={right} />
      </div>
    </section>
  );
}
