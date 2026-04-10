import Link from 'next/link';
import type { ReactNode } from 'react';
import { InnSourcesLine } from '@/components/inn-sources-line';
import { SupplierPortalBadgeIcon } from '@/components/product/supplier-portal-badge-icon';
import { PORTAL_BADGE_LABELS, resolveSupplierPortalBadge } from '@/lib/supplier-portal-badge';
import type { ApiSupplierCard } from '@/lib/types/catalog';

function websiteHref(raw: string): string {
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) {
    return t;
  }
  return `https://${t}`;
}

function OptionalBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-[#6a7282]">{label}</p>
      <div className="mt-1 text-base text-ink">{children}</div>
    </div>
  );
}

export function ProductSupplierSidebar({
  card,
  className,
}: {
  card: ApiSupplierCard;
  className?: string;
}) {
  const portalBadge = resolveSupplierPortalBadge(card);
  const portalTitle = PORTAL_BADGE_LABELS[portalBadge];

  return (
    <aside
      className={`w-full shrink-0 rounded-lg bg-white px-6 py-8 shadow-sm lg:w-[435px] lg:rounded-[10px] lg:pb-8 lg:pt-6 ${className ?? ''}`}
    >
      <h2 className="text-lg font-semibold text-ink">Информация о поставщике</h2>
      <div className="mt-4 flex flex-col gap-2 lg:gap-4">
        <OptionalBlock label="Наименование компании">
          <Link href={`/suppliers/${card.slug}`} className="hover:text-brand hover:underline">
            {card.companyName}
          </Link>
        </OptionalBlock>
        <OptionalBlock label="Адрес">{card.address ?? '—'}</OptionalBlock>
        {card.website ? (
          <OptionalBlock label="Сайт">
            <a href={websiteHref(card.website)} className="text-brand hover:underline" target="_blank" rel="noreferrer">
              {card.website}
            </a>
          </OptionalBlock>
        ) : (
          <OptionalBlock label="Сайт">—</OptionalBlock>
        )}
        <OptionalBlock label="Контактные данные">{card.phone ?? '—'}</OptionalBlock>
        <div>
          <p className="text-sm text-[#6a7282]">ИНН</p>
          <div className="mt-1 space-y-0.5">
            <p className="text-base text-ink">{card.inn ?? '—'}</p>
            {card.innSourcesLine ? (
              <InnSourcesLine line={card.innSourcesLine} inn={card.inn} className="text-sm text-brand" />
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-sm text-[#6a7282]">На портале</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex shrink-0" title={portalTitle}>
              <SupplierPortalBadgeIcon badge={portalBadge} className="size-5" />
            </span>
            <span className="text-base text-ink">{card.onPortalSince ?? '—'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
