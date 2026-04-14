import { Fragment } from 'react';
import { innSourceHrefForLabel, normalizeInnDigits, splitInnSourcesLine } from '@/lib/links/inn-registry-links';

type InnSourcesLineProps = {
  line: string;
  inn: string | null | undefined;
  className?: string;
  linkClassName?: string;
  asChips?: boolean;
};

export function InnSourcesLine({ line, inn, className, linkClassName, asChips = false }: InnSourcesLineProps) {
  const digits = normalizeInnDigits(inn);
  const segments = splitInnSourcesLine(line);

  if (segments.length === 0) {
    return null;
  }

  const linkCls = linkClassName ?? 'text-brand hover:underline';
  const chipClassName =
    linkClassName ??
    'inline-flex h-7 items-center rounded-[8px] border border-[#dbe4f3] bg-[#f3f7ff] px-2.5 text-xs font-medium text-brand transition-colors hover:bg-[#e5efff] hover:text-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#dbe9ff]';

  if (asChips) {
    return (
      <div className={className}>
        <div className="flex flex-wrap gap-1.5">
          {segments.map((segment, i) => {
            const href = digits ? innSourceHrefForLabel(segment, digits) : null;
            return href ? (
              <a
                key={`${i}-${segment}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={chipClassName}
              >
                {segment}
              </a>
            ) : (
              <span key={`${i}-${segment}`} className="inline-flex h-7 items-center rounded-[8px] bg-[#f4f5f9] px-2.5 text-xs text-[#6a7282]">
                {segment}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <p className={className}>
      {segments.map((segment, i) => {
        const href = digits ? innSourceHrefForLabel(segment, digits) : null;
        return (
          <Fragment key={`${i}-${segment}`}>
            {i > 0 ? <span className="mx-0.5">·</span> : null}
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {segment}
              </a>
            ) : (
              <span>{segment}</span>
            )}
          </Fragment>
        );
      })}
    </p>
  );
}
