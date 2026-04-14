'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { InnSourcesLine } from '@/components/inn-sources-line';
import {
  suppliersPath,
  toggleSuppliersSort,
  type SuppliersSortParam,
  type SuppliersUrlState,
} from '@/lib/suppliers/suppliers-params';
import type { ApiSupplierRef } from '@/lib/types/catalog';

/**
 * Поставщик | Склады | Сайт | Телефон | Почта | Другое (Figma 0:4474 ~1003px).
 * «Другое» — min 196px (−8px к прежним 204px), доли первых колонок чуть выше.
 */
const GRID_COLS = '188px 179px 143px 143px 143px 204px';

const thClass = 'min-w-0 px-6';
const tdClass = 'min-w-0 max-w-full px-6 py-4';

function ThSortName({ state, label }: { state: SuppliersUrlState; label: ReactNode }) {
  const nextSort = toggleSuppliersSort(state.sort);
  const href = suppliersPath({ ...state, sort: nextSort, page: 1 });
  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center font-bold text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1"
    >
      {label}
    </Link>
  );
}

function dash(v: string | null | undefined): string {
  const t = (v ?? '').trim();
  return t || '—';
}

function EmailLines({ line }: { line: string | null | undefined }) {
  const raw = (line ?? '').trim();
  if (!raw) {
    return '—';
  }
  const parts = raw.split(/,\s*/).filter(Boolean);
  if (parts.length <= 1) {
    return <span className="break-all">{raw}</span>;
  }
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className="break-all">
          {i > 0 ? <br /> : null}
          {p}
        </span>
      ))}
    </>
  );
}

export function SuppliersResultsTable({
  items,
  state,
}: {
  items: ApiSupplierRef[];
  state: SuppliersUrlState;
}) {
  return (
    <div className="hidden w-full overflow-x-auto rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:block">
      <div className="min-w-[1000px] border-b border-[#e5e5e5] bg-white" role="rowgroup">
        <div
          className="grid min-h-[81px] w-full items-center gap-x-0 text-base font-bold text-ink"
          style={{ gridTemplateColumns: GRID_COLS }}
          role="row"
        >
          <div className={thClass} role="columnheader">
            <ThSortName state={state} label="Поставщик" />
          </div>
          <div className={thClass} role="columnheader">
            Склады
          </div>
          <div className={thClass} role="columnheader">
            Сайт
          </div>
          <div className={thClass} role="columnheader">
            Телефон
          </div>
          <div className={thClass} role="columnheader">
            Почта
          </div>
          <div className={thClass} role="columnheader">
            Другое
          </div>
        </div>
      </div>
      <div className="min-w-[1000px]" role="rowgroup">
        {items.map((s) => (
          <div
            key={s.id}
            className="grid min-h-[100px] w-full items-center gap-x-0 border-b border-[#e5e5e5] last:border-b-0"
            style={{ gridTemplateColumns: GRID_COLS }}
            role="row"
          >
            <div className={tdClass} role="cell">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/suppliers/${s.slug}`}
                  className="break-words text-base font-normal leading-normal text-ink hover:text-brand hover:underline"
                  prefetch={false}
                >
                  {s.name}
                </Link>
                {s.inn ? (
                  <p className="text-sm leading-normal text-[#6a7282]">ИНН {s.inn}</p>
                ) : null}
              </div>
            </div>
            <div className={`${tdClass} break-words text-base font-normal leading-normal text-ink`} role="cell">
              {dash(s.warehouseCitiesLine)}
            </div>
            <div className={`${tdClass} text-sm font-semibold leading-normal text-brand`} role="cell">
              {s.website ? (
                <a
                  href={s.website.startsWith('http') ? s.website : `https://${s.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block max-w-full break-all hover:underline"
                >
                  {s.website}
                </a>
              ) : (
                '—'
              )}
            </div>
            <div className={`${tdClass} break-words text-sm font-normal leading-normal text-[#6a7282]`} role="cell">
              {dash(s.phone)}
            </div>
            <div className={`${tdClass} text-sm font-normal leading-normal text-[#6a7282]`} role="cell">
              <EmailLines line={s.emailsLine} />
            </div>
            <div className={`${tdClass} break-words text-sm font-normal leading-normal text-[#6a7282]`} role="cell">
              {s.otherLine?.trim() ? (
                <InnSourcesLine
                  line={s.otherLine}
                  inn={s.inn}
                  className="max-w-full"
                  linkClassName="text-[#6a7282] transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1"
                />
              ) : (
                '—'
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
