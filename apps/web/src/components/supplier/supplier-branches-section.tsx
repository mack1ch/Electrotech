import Link from 'next/link';
import type { ApiSupplierBranch } from '@/lib/types/catalog';

export function SupplierBranchesSection({
  branches,
  className,
}: {
  branches: ApiSupplierBranch[];
  className?: string;
}) {
  if (branches.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-ink lg:text-[21px]">Филиалы</h2>
      <div className="mt-4 flex flex-col gap-2 lg:mt-4 lg:flex-row lg:flex-wrap lg:gap-5">
        {branches.map((b, idx) => (
          <div
            key={`${b.city}-${b.address}-${idx}`}
            className="flex w-full flex-col gap-6 rounded-lg bg-white px-6 py-6 shadow-sm lg:w-[321px] lg:max-w-[321px] lg:px-[23px]"
          >
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="text-lg font-semibold text-ink lg:text-[21px]">{b.city}</h3>
                <p className="mt-1 text-sm leading-5 text-ink lg:text-lg lg:leading-5">{b.address}</p>
              </div>
              <div className="text-base leading-5 text-[#a7a7a7]">
                <p className="mb-0">{b.hoursWeekday}</p>
                <p>{b.hoursWeekend}</p>
              </div>
            </div>
            <Link
              href="/search"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-[#0a0a0a] px-3 py-2 text-xs font-normal text-white lg:px-4 lg:py-3 lg:text-lg lg:leading-5"
              prefetch={false}
            >
              {b.productCount} товаров
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
