import Link from 'next/link';
import type { ReactNode } from 'react';

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      className="mb-4 text-xs font-normal leading-normal text-[#4a5565] lg:mb-6 lg:text-sm"
      aria-label="Хлебные крошки"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 ? (
              <span className="px-0.5 text-[#4a5565]" aria-hidden>
                ›
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-normal text-brand">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
      <div>
        <h1 className="text-lg font-semibold leading-normal tracking-tight text-ink lg:text-[32px] lg:leading-8">
          {title}
        </h1>
        {subtitle ? (
          <div className="mt-1 text-xs leading-5 text-[#4a5565] lg:mt-2 lg:text-base lg:text-ink-secondary lg:leading-normal">
            {subtitle}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
