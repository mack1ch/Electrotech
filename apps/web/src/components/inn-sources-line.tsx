import { Fragment } from 'react';
import { innSourceHrefForLabel, normalizeInnDigits, splitInnSourcesLine } from '@/lib/links/inn-registry-links';

type InnSourcesLineProps = {
  line: string;
  inn: string | null | undefined;
  className?: string;
  linkClassName?: string;
};

export function InnSourcesLine({ line, inn, className, linkClassName }: InnSourcesLineProps) {
  const digits = normalizeInnDigits(inn);
  const segments = splitInnSourcesLine(line);

  if (segments.length === 0) {
    return null;
  }

  const linkCls = linkClassName ?? 'text-brand hover:underline';

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
