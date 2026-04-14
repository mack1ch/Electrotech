import Link from 'next/link';
import { InnSourcesLine } from '@/components/inn-sources-line';
import type { ApiSupplierRef } from '@/lib/types/catalog';

function dash(v: string | null | undefined): string {
  const t = (v ?? '').trim();
  return t || '—';
}

function ContactEmails({ line }: { line: string | null | undefined }) {
  const raw = (line ?? '').trim();
  if (!raw) {
    return <span className="text-[#8d8d8d]">—</span>;
  }
  const parts = raw.split(/,\s*/).filter(Boolean);
  if (parts.length <= 1) {
    return <span className="break-all text-[#8d8d8d]">{raw}</span>;
  }
  return (
    <span className="text-left text-[#8d8d8d]">
      {parts.map((p, i) => (
        <span key={i} className="block break-all">
          {p}
        </span>
      ))}
    </span>
  );
}

/**
 * Мобильный каталог поставщиков — одна белая панель, шапка «Поставщик | Контакты» (Figma 0:4627).
 */
export function SuppliersMobileResults({ items }: { items: ApiSupplierRef[] }) {
  return (
    <div className="-mx-4 overflow-hidden bg-white sm:-mx-6 lg:hidden">
      <div className="px-4 pb-4 pt-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 text-sm font-bold leading-normal text-ink sm:gap-6">
          <span>Поставщик</span>
          <span className="text-left">Контакты</span>
        </div>
        <div className="mt-2 h-px w-full bg-[#e5e5e5]" aria-hidden />
      </div>

      <div className="flex flex-col px-4 pb-8 pt-[14px] sm:px-6">
        {items.map((s, index) => (
          <div
            key={s.id}
            className={
              index > 0 ? 'mt-6 border-t border-[#e5e5e5] pt-6' : ''
            }
          >
            <div className="grid grid-cols-2 items-start gap-4 sm:gap-6">
              <div className="min-w-0">
                <Link
                  href={`/suppliers/${s.slug}`}
                  className="text-sm font-medium leading-normal text-ink hover:text-brand hover:underline"
                  prefetch={false}
                >
                  {s.name}
                </Link>
                {s.inn ? <p className="mt-1 text-xs leading-normal text-[#8d8d8d]">ИНН {s.inn}</p> : null}
                {s.warehouseCitiesLine?.trim() ? (
                  <p className="mt-1 text-xs leading-normal text-[#8d8d8d]">{s.warehouseCitiesLine.trim()}</p>
                ) : null}
                {s.otherLine?.trim() ? (
                  <InnSourcesLine
                    line={s.otherLine}
                    inn={s.inn}
                    asChips
                    className="mt-2"
                    linkClassName="inline-flex h-7 items-center rounded-[8px] border border-[#dbe4f3] bg-[#f3f7ff] px-2.5 text-[11px] font-medium text-brand transition-colors hover:bg-[#e5efff] hover:text-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#dbe9ff]"
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-col items-start gap-2 text-left text-xs leading-normal">
                {s.website ? (
                  <a
                    href={s.website.startsWith('http') ? s.website : `https://${s.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-brand hover:underline"
                  >
                    {s.website}
                  </a>
                ) : (
                  <span className="text-[#8d8d8d]">—</span>
                )}
                <span className="break-words text-[#8d8d8d]">{dash(s.phone)}</span>
                <div className="w-full text-left">
                  <ContactEmails line={s.emailsLine} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
