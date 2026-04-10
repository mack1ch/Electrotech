import { formatRub } from '@/lib/format/price';
import { displayArticle, formatStockUnits, isPriceOnRequest, PRICE_ON_REQUEST_LABEL } from '@/lib/format/search-table';
import type { ApiProductDetail } from '@/lib/types/catalog';

function formatPriceRange(price: string, priceMax: string | null): string {
  if (isPriceOnRequest(price)) {
    return PRICE_ON_REQUEST_LABEL;
  }
  const lo = formatRub(price);
  if (!priceMax) {
    return `${lo} ₽`;
  }
  const hi = formatRub(priceMax);
  return `${lo} — ${hi} ₽`;
}

export function ProductHeroCard({
  product,
  className,
}: {
  product: ApiProductDetail;
  className?: string;
}) {
  const article = displayArticle(product);
  const manufacturer = product.manufacturer ?? '—';

  return (
    <section
      className={`rounded-lg bg-white px-6 py-8 shadow-sm lg:pb-4 lg:pt-8 ${className ?? ''}`}
    >
      <h1 className="text-lg font-semibold leading-normal text-ink lg:text-[21px]">{product.name}</h1>

      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 lg:hidden">
        <div className="space-y-1">
          <p className="text-sm text-[#6a7282]">{product.priceMax ? 'Диапазон цен' : 'Цена'}</p>
          <p className="text-lg font-semibold text-brand">{formatPriceRange(product.price, product.priceMax)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-[#6a7282]">Максимальное количество</p>
          <p className="text-lg font-semibold text-brand">{formatStockUnits(product.stockQuantity)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-[#6a7282]">Артикул</p>
          <p className="text-base font-normal text-ink">{article}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-[#6a7282]">Производитель</p>
          <p className="text-base font-normal text-ink">{manufacturer}</p>
        </div>
      </div>

      <div className="mt-6 hidden items-start justify-between gap-4 lg:flex">
        <div className="min-w-[140px] flex-1 space-y-1">
          <p className="text-base text-[#6a7282]">{product.priceMax ? 'Диапазон цен' : 'Цена'}</p>
          <p className="text-2xl font-semibold text-brand">{formatPriceRange(product.price, product.priceMax)}</p>
        </div>
        <div className="min-w-[160px] flex-1 space-y-1 whitespace-normal">
          <p className="text-sm text-[#6a7282]">Максимальное количество</p>
          <p className="text-2xl font-semibold text-brand">{formatStockUnits(product.stockQuantity)}</p>
        </div>
        <div className="min-w-[120px] flex-1 space-y-1">
          <p className="text-sm text-[#6a7282]">Артикул</p>
          <p className="text-lg font-normal text-ink">{article}</p>
        </div>
        <div className="min-w-[140px] flex-1 space-y-1">
          <p className="text-sm text-[#6a7282]">Производитель</p>
          <p className="text-lg font-normal text-ink">{manufacturer}</p>
        </div>
      </div>
    </section>
  );
}
