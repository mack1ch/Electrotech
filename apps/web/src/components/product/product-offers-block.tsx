import type { ApiProductOffer } from '@/lib/types/catalog';
import { ProductOffersMobile } from '@/components/product/product-offers-mobile';
import { ProductOffersTable } from '@/components/product/product-offers-table';

export function ProductOffersBlock({ offers }: { offers: ApiProductOffer[] }) {
  const rows = offers.filter((o) => o.supplierName.trim());
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="mb-4 text-lg font-semibold text-ink lg:text-[21px]">Лучшие предложения</h2>
      <ProductOffersMobile offers={rows} />
      <ProductOffersTable offers={rows} />
    </section>
  );
}
