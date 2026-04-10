'use client';

import type { RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@electrotech/ui';

const MAX_LINES = 5;

function getLineHeightPx(el: HTMLElement): number {
  const s = getComputedStyle(el);
  const lh = parseFloat(s.lineHeight);
  if (!Number.isNaN(lh)) {
    return lh;
  }
  const fs = parseFloat(s.fontSize);
  return !Number.isNaN(fs) ? fs * 1.5 : 22;
}

function renderBody(
  text: string,
  pClass: string,
  opts: { clamp?: boolean; measureRef?: RefObject<HTMLParagraphElement | null> },
) {
  return (
    <p
      ref={opts.measureRef}
      className={cn('mb-0 whitespace-pre-wrap', pClass, opts.clamp && 'line-clamp-5')}
    >
      {text.length > 0 ? text : '\u00a0'}
    </p>
  );
}

type DescriptionReadMoreSectionProps = {
  text: string;
  title?: string;
  className?: string;
  headingClassName: string;
  contentClassName: string;
};

/**
 * До 5 строк — весь текст и без «Подробнее». Больше — обрезка (`line-clamp-5`) и кнопки «Подробнее» / «Скрыть».
 */
export function DescriptionReadMoreSection({
  text,
  title = 'Описание',
  className,
  headingClassName,
  contentClassName,
}: DescriptionReadMoreSectionProps) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) {
      return;
    }
    const lh = getLineHeightPx(el);
    setNeedsMore(el.scrollHeight > lh * MAX_LINES + 1);
  }, [text]);

  return (
    <section
      className={cn(
        'relative rounded-lg bg-white px-6 pt-8 shadow-sm',
        expanded ? 'pb-6' : needsMore ? 'pb-10' : 'pb-6',
        className,
      )}
    >
      <h2 className={headingClassName}>{title}</h2>
      <div className="relative mt-2">
        <div
          className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10 w-full"
          aria-hidden
        >
          {renderBody(text, contentClassName, { measureRef })}
        </div>

        <div>{renderBody(text, contentClassName, { clamp: needsMore && !expanded })}</div>

        {needsMore && !expanded ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-0 left-0 right-0 flex h-[77px] items-center bg-gradient-to-t from-white from-35% to-transparent px-6">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="text-base font-semibold text-brand hover:underline"
              >
                Подробнее
              </button>
            </div>
          </>
        ) : null}

        {needsMore && expanded ? (
          <div className="mt-4 flex justify-start">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-base font-semibold text-brand hover:underline"
            >
              Скрыть
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
