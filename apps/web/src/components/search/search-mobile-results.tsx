import Link from 'next/link';
import {
  displayArticle,
  formatMobilePricePerPiece,
  mobileAvailabilityPrimary,
  mobileAvailabilityUnit,
} from '@/lib/format/search-table';
import type { ApiProduct } from '@/lib/types/catalog';

/** Мобильный список — Figma 0:2102–0:2166: полная ширина, заголовок «Поставщик | Наличие», шаг 24px. */
export function SearchMobileResults({ items }: { items: ApiProduct[] }) {
  return (
    <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden bg-white sm:-mx-6 sm:w-[calc(100%+3rem)] lg:mx-0 lg:hidden lg:w-full lg:rounded-lg lg:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between text-sm font-bold leading-normal text-ink">
          <span>Поставщик</span>
          <span>Наличие</span>
        </div>
        <div className="mt-2 h-px w-full bg-[#e5e5e5]" />
      </div>
      <ul className="flex flex-col gap-6 px-4 pb-6 pt-[14px]">
        {items.map((p) => (
          <li key={p.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 pr-1">
              <Link
                href={`/suppliers/${p.supplier.slug}`}
                className="text-sm font-medium leading-normal text-ink hover:text-brand hover:underline"
                prefetch={false}
              >
                {p.supplier.name}
              </Link>
              <div className="mt-2 flex flex-col gap-1 text-xs font-normal leading-normal">
                <Link href={`/product/${p.slug}`} className="text-ink hover:text-brand">
                  {p.name}
                </Link>
                <p className="text-[#8d8d8d]">
                  <span>арт</span>
                  <span className="tracking-[0.16px]">{'. '}</span>
                  <span>{displayArticle(p)}</span>
                </p>
              </div>
            </div>
            <div className="flex w-11 shrink-0 flex-col items-end gap-1 whitespace-nowrap text-right">
              <p className="text-ink">
                <span className="text-base font-normal leading-normal">{mobileAvailabilityPrimary(p)}</span>
                <span className="text-sm">{'\u00a0'}</span>
                <span className="text-xs leading-normal text-[#8d8d8d]">{mobileAvailabilityUnit(p)}</span>
              </p>
              <p className="text-xs font-normal leading-normal text-brand">{formatMobilePricePerPiece(p.price)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
