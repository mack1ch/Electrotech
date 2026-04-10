import Link from 'next/link';
import { formatMobilePricePerPiece, formatStockUnits } from '@/lib/format/search-table';
import type { ApiProductOffer } from '@/lib/types/catalog';

function AvailabilityTop({ offer }: { offer: ApiProductOffer }) {
  const line = offer.availabilityLine?.trim();
  if (line) {
    const m = line.match(/^([\d\s\u00a0]+)\s*(.+)$/);
    const numPart = m?.[1];
    const unitPart = m?.[2];
    if (numPart != null && unitPart != null) {
      return (
        <p className="text-ink">
          <span className="text-base font-normal">{numPart.replace(/\s/g, ' ').trim()}</span>
          <span className="text-sm"> </span>
          <span className="text-xs text-[#8d8d8d]">{unitPart}</span>
        </p>
      );
    }
    return <p className="text-base text-ink">{line}</p>;
  }
  return (
    <p className="text-ink">
      <span className="text-base">{formatStockUnits(offer.stockQuantity)}</span>
      <span className="text-sm"> </span>
      <span className="text-xs text-[#8d8d8d]">шт</span>
    </p>
  );
}

export function ProductOffersMobile({ offers }: { offers: ApiProductOffer[] }) {
  const rows = offers.filter((o) => o.supplierName.trim());

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="border-b border-[#e5e5e5] px-4 pb-2 pt-4">
        <div className="flex items-center justify-between text-sm font-bold text-ink">
          <span>Поставщик</span>
          <span>Наличие</span>
        </div>
        <div className="mt-2 h-px w-full bg-[#e5e5e5]" aria-hidden />
      </div>
      <div className="flex flex-col gap-6 px-4 py-6">
        {rows.map((row, idx) => (
          <div key={`${row.supplierSlug}-${idx}`} className="flex items-start justify-between gap-3">
            <div className="min-w-0 max-w-[256px] flex-1">
              <Link
                href={`/suppliers/${row.supplierSlug}`}
                className="text-sm font-medium text-ink hover:text-brand hover:underline"
                prefetch={false}
              >
                {row.supplierName}
              </Link>
              <div className="mt-2 flex flex-col gap-1 text-xs">
                {row.warehouseLines.map((line, i) => (
                  <span key={i} className="leading-normal text-ink">
                    {line}
                  </span>
                ))}
                <span className="text-[#8d8d8d]">
                  Мин. заказ {row.minOrderQuantity != null ? `${formatStockUnits(row.minOrderQuantity)} шт` : '—'}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 whitespace-nowrap text-right">
              <AvailabilityTop offer={row} />
              <span className="text-xs font-normal text-brand">{formatMobilePricePerPiece(row.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
