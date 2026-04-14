import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SupplierBranchesSection } from '@/components/supplier/supplier-branches-section';
import { SupplierContactCard } from '@/components/supplier/supplier-contact-card';
import { SupplierDescriptionSection } from '@/components/supplier/supplier-description-section';
import { SupplierDetailBreadcrumbs } from '@/components/supplier/supplier-detail-breadcrumbs';
import { SupplierNotesCard } from '@/components/supplier/supplier-notes-card';
import { fetchPublicApiJson, PublicApiError } from '@/lib/api/public-api';
import type { ApiSupplierDetail } from '@/lib/types/catalog';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SupplierDetailPage(props: PageProps) {
  const { slug } = await props.params;

  let supplier: ApiSupplierDetail | null = null;

  try {
    supplier = await fetchPublicApiJson<ApiSupplierDetail>(`/suppliers/${encodeURIComponent(slug)}`);
  } catch (e) {
    if (e instanceof PublicApiError && e.status === 404) {
      notFound();
    }
    supplier = null;
  }

  if (!supplier) {
    return (
      <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-9">
          <nav className="text-xs text-[#4a5565] lg:text-sm" aria-label="Хлебные крошки">
            <Link href="/" className="hover:underline">
              Главная
            </Link>
            <span className="mx-2 text-[#4a5565]">/</span>
            <Link href="/suppliers" className="hover:underline">
              Каталог поставщиков
            </Link>
          </nav>
          <h1 className="mt-4 text-xl font-normal text-ink">Не удалось загрузить поставщика</h1>
          <p className="mt-2 text-sm text-[#6a7282]">Проверьте, что API доступен, и повторите попытку.</p>
          <p className="mt-6">
            <Link href="/suppliers" className="text-sm font-medium text-brand hover:underline">
              К каталогу поставщиков
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f5f9] pb-16 pt-3 lg:pt-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-9">
        <SupplierDetailBreadcrumbs supplierName={supplier.name} />

        <header className="mt-2 flex flex-col gap-3 lg:mt-1">
          <h1 className="text-lg font-normal leading-normal text-ink lg:text-2xl lg:leading-8">{supplier.name}</h1>
          {supplier.legalAddress ? (
            <p className="text-xs leading-normal text-[#4a5565] lg:text-lg lg:text-[#8d8d8d]">
              {supplier.legalAddress}
            </p>
          ) : null}
          <div className="pt-1">
            <Link
              href={`/search?supplier=${encodeURIComponent(supplier.slug)}`}
              className="inline-flex h-11 items-center justify-center rounded-[6px] bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 active:bg-[#17355f]"
            >
              Смотреть товары поставщика
            </Link>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1005px)_321px] lg:items-start lg:gap-5">
          <div className="flex min-w-0 flex-col gap-8 lg:gap-10">
            <SupplierContactCard supplier={supplier} />
            <SupplierBranchesSection branches={supplier.branches} />
          </div>
          <SupplierNotesCard supplierSlug={supplier.slug} className="lg:sticky lg:top-6 lg:self-start" />
        </div>

        {supplier.description ? (
          <SupplierDescriptionSection text={supplier.description} className="mt-8 shadow-sm lg:mt-10" />
        ) : null}
      </div>
    </div>
  );
}
