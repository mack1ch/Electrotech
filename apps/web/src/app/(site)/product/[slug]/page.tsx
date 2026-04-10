import { notFound } from 'next/navigation';
import { ProductDescriptionBlock } from '@/components/product/product-description-block';
import { ProductDetailBreadcrumbs } from '@/components/product/product-detail-breadcrumbs';
import { ProductHeroCard } from '@/components/product/product-hero-card';
import { ProductOffersBlock } from '@/components/product/product-offers-block';
import { ProductSpecifications } from '@/components/product/product-specifications';
import { ProductSupplierSidebar } from '@/components/product/product-supplier-sidebar';
import { fetchPublicApiJson, PublicApiError } from '@/lib/api/public-api';
import type { ApiProductDetail } from '@/lib/types/catalog';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage(props: PageProps) {
  const { slug } = await props.params;

  let product: ApiProductDetail | null = null;

  try {
    product = await fetchPublicApiJson<ApiProductDetail>(`/products/${encodeURIComponent(slug)}`);
  } catch (e) {
    if (e instanceof PublicApiError && e.status === 404) {
      notFound();
    }
    throw e;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-9">
        <ProductDetailBreadcrumbs productName={product.name} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,862px)_435px] lg:items-start lg:gap-x-5 lg:gap-y-8">
          <ProductHeroCard product={product} className="lg:col-start-1 lg:row-start-1" />
          <ProductSupplierSidebar
            card={product.supplierCard}
            className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-6"
          />
          <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2 lg:gap-8">
            <ProductSpecifications specs={product.specifications} />
            {product.description ? <ProductDescriptionBlock text={product.description} /> : null}
          </div>
        </div>

        <div className="mt-8 lg:mt-10">
          <ProductOffersBlock offers={product.offers} />
        </div>
      </div>
    </div>
  );
}
