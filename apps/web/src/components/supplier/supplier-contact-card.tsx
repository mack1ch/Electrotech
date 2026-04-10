import type { ReactNode } from 'react';
import { InnSourcesLine } from '@/components/inn-sources-line';
import type { ApiSupplierDetail } from '@/lib/types/catalog';

function websiteHref(raw: string): string {
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) {
    return t;
  }
  return `https://${t}`;
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-start justify-between gap-3 text-sm lg:items-center lg:gap-4 lg:text-base">
        <span className="shrink-0 text-[#6a7282]">{label}</span>
        <div className={`min-w-0 max-w-[min(100%,220px)] text-right font-semibold lg:max-w-none ${valueClassName ?? 'text-ink'}`}>
          {value}
        </div>
      </div>
      <div className="h-px w-full bg-[#e5e5e5]" aria-hidden />
    </div>
  );
}

export function SupplierContactCard({ supplier }: { supplier: ApiSupplierDetail }) {
  const { website, inn, innSourcesLine, contactPerson, phone, email } = supplier;
  const hasDetails = Boolean(
    website || inn || innSourcesLine || contactPerson || phone || email,
  );

  if (!hasDetails) {
    return (
      <section className="rounded-lg bg-white px-6 py-8 shadow-sm lg:min-h-[120px] lg:px-6 lg:py-8">
        <p className="text-sm text-[#6a7282] lg:text-base">
          Подробные контакты и реквизиты для этого поставщика пока не заполнены в каталоге.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg bg-white px-6 py-8 shadow-sm lg:min-h-[176px] lg:px-6 lg:py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-10">
        <div className="flex flex-col gap-6">
          {website ? (
            <DetailRow
              label="Сайт"
              value={
                <a href={websiteHref(website)} className="text-brand hover:underline" target="_blank" rel="noreferrer">
                  {website.replace(/^https?:\/\//i, '')}
                </a>
              }
              valueClassName="text-brand"
            />
          ) : null}
          {inn ? (
            <DetailRow label="ИНН" value={<span className="text-ink">{inn}</span>} />
          ) : null}
          {innSourcesLine ? (
            <InnSourcesLine
              line={innSourcesLine}
              inn={inn}
              className="text-sm text-ink lg:text-base"
              linkClassName="text-brand hover:underline"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-6">
          {contactPerson ? (
            <DetailRow
              label="Контактное лицо"
              value={<span className="whitespace-normal text-ink">{contactPerson}</span>}
            />
          ) : null}
          {phone ? (
            <DetailRow
              label="Телефон"
              value={
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-brand hover:underline">
                  {phone}
                </a>
              }
              valueClassName="text-brand"
            />
          ) : null}
          {email ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3 text-sm lg:items-center lg:gap-4 lg:text-base">
                <span className="shrink-0 text-[#6a7282]">Почта</span>
                <a
                  href={`mailto:${email}`}
                  className="min-w-0 max-w-[min(100%,220px)] text-right font-semibold text-brand hover:underline lg:max-w-none"
                >
                  {email}
                </a>
              </div>
              <div className="h-px w-full bg-[#e5e5e5]" aria-hidden />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
