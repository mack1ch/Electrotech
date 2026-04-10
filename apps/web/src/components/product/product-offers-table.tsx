import { ArrowDownAz, Calendar, Package } from 'lucide-react';
import Link from 'next/link';
import { formatTableDate, formatTablePriceRub, formatStockUnits } from '@/lib/format/search-table';
import type { ApiProductOffer } from '@/lib/types/catalog';

function SortDecor() {
  return <ArrowDownAz className="inline size-4 shrink-0 text-ink/45" strokeWidth={1.75} aria-hidden />;
}

export function ProductOffersTable({ offers }: { offers: ApiProductOffer[] }) {
  return (
    <div className="hidden w-full overflow-x-auto rounded-[10px] bg-white pb-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:block">
      <table className="w-full min-w-[1150px] border-collapse text-left">
        <thead>
          <tr className="h-[81px] border-b border-[#e5e5e5] bg-white">
            <th className="w-[188px] px-6 align-middle text-base font-bold text-ink">Поставщик</th>
            <th className="w-[67px] whitespace-nowrap px-2 text-right align-middle text-base font-bold text-ink">
              <span className="inline-flex items-center justify-end gap-1">
                Цена
                <SortDecor />
              </span>
            </th>
            <th className="w-[78px] px-2 align-middle text-base font-bold text-ink">Склады</th>
            <th className="w-[129px] whitespace-nowrap px-2 text-right align-middle text-base font-bold text-ink">
              <span className="inline-flex items-center justify-end gap-1">
                <span>
                  Наличие<span className="tracking-tight">, шт</span>
                </span>
                <SortDecor />
              </span>
            </th>
            <th className="w-[129px] whitespace-nowrap px-2 text-right align-middle text-base font-bold text-ink">
              <span className="inline-flex items-center justify-end gap-1">
                Мин. заказ
                <SortDecor />
              </span>
            </th>
            <th className="w-[219px] whitespace-nowrap px-2 align-middle text-base font-bold text-ink">
              <span className="inline-flex items-center gap-1">
                Последнее обновление
                <SortDecor />
              </span>
            </th>
            <th className="w-[170px] px-2 align-middle text-base font-bold text-ink">Телефон</th>
            <th className="w-[170px] px-4 align-middle text-base font-bold text-ink">Почта</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((row, idx) => (
            <tr key={`${row.supplierSlug}-${idx}`} className="border-b border-[#e5e5e5] last:border-0">
              <td className="px-6 py-6 align-middle text-base font-normal text-ink">
                {row.supplierName ? (
                  <Link
                    href={`/suppliers/${row.supplierSlug}`}
                    className="hover:text-brand hover:underline"
                    prefetch={false}
                  >
                    {row.supplierName}
                  </Link>
                ) : null}
              </td>
              <td className="px-2 py-6 text-right align-middle text-sm text-[#4a5565]">
                {formatTablePriceRub(row.price)}
              </td>
              <td className="px-2 py-6 align-middle text-sm text-[#4a5565]">
                {row.warehouseLines.map((line, i) => (
                  <span key={i} className="block leading-snug">
                    {line}
                  </span>
                ))}
              </td>
              <td className="px-2 py-6 align-middle">
                <span className="inline-flex items-center gap-1 text-sm text-[#4a5565]">
                  <Package className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  {formatStockUnits(row.stockQuantity)}
                </span>
              </td>
              <td className="px-2 py-6 align-middle">
                <span className="inline-flex items-center gap-1 text-sm text-[#4a5565]">
                  <Package className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  {row.minOrderQuantity != null ? `от ${formatStockUnits(row.minOrderQuantity)}` : '—'}
                </span>
              </td>
              <td className="px-2 py-6 align-middle">
                <span className="inline-flex items-center gap-1 text-sm text-[#4a5565]">
                  <Calendar className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  {formatTableDate(row.lastUpdatedAt)}
                </span>
              </td>
              <td className="px-2 py-6 align-middle text-sm font-semibold text-ink">{row.phone ?? '—'}</td>
              <td className="px-4 py-6 align-middle text-sm font-semibold text-ink">{row.email ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
