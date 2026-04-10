'use client';

import { ChevronDown, LayoutGrid, QrCode, Search } from 'lucide-react';
import Link from 'next/link';
import { CityPicker } from '@/components/city-picker';
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white lg:static lg:z-auto lg:border-neutral-200">
      {/* Мобильная полоса: компактная высота */}
      <div className="mx-auto flex h-12 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:hidden">
        <Link
          href="/"
          className="text-xs font-black uppercase leading-3 tracking-[0.24px] text-ink sm:text-[13px] sm:leading-[13px]"
        >
          Электротехника
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/search"
            className="flex size-8 items-center justify-center rounded-lg bg-brand text-white"
            aria-label="Товары"
          >
            <LayoutGrid className="size-[18px]" strokeWidth={1.75} aria-hidden />
          </Link>
          <Link
            href="/search"
            className="flex size-8 items-center justify-center rounded-lg bg-brand text-white"
            aria-label="Поиск"
          >
            <Search className="size-[18px]" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:px-8 lg:py-0 lg:pt-3 lg:pb-3.5">
        <div className="flex shrink-0 items-center justify-between gap-3 lg:justify-start">
          <Link
            href="/"
            className="font-black uppercase leading-5 tracking-[0.48px] text-ink lg:text-xl lg:leading-5"
          >
            Электротехника
          </Link>
          <CityPicker variant="site" className="text-sm lg:hidden" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-center lg:max-w-3xl lg:justify-center">
          <Link
            href="/search"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded bg-brand px-4 text-sm font-semibold text-white sm:h-11 lg:rounded-sm"
          >
            <QrCode className="size-3 text-white" strokeWidth={2} aria-hidden />
            Товары
          </Link>

          <form
            action="/search"
            method="get"
            className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 rounded-lg border-2 border-brand px-1.5 py-1 sm:min-h-11 sm:px-2 sm:py-1.5"
          >
            <details className="group relative shrink-0">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md bg-brand-muted px-3 py-2 text-xs font-semibold text-brand sm:text-sm [&::-webkit-details-marker]:hidden">
                Товары
                <ChevronDown className="size-4 text-brand" strokeWidth={1.75} aria-hidden />
              </summary>
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-md border border-neutral-200 bg-white py-1 shadow-md">
                <Link
                  href="/search"
                  className="block px-3 py-2 text-sm text-ink hover:bg-neutral-50"
                >
                  Товары
                </Link>
                <Link
                  href="/suppliers"
                  className="block px-3 py-2 text-sm text-ink hover:bg-neutral-50"
                >
                  Поставщики
                </Link>
              </div>
            </details>
            <input
              name="q"
              type="search"
              placeholder="Поиск"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:text-[15px]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 text-brand"
              aria-label="Искать"
            >
              <Search className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </form>
        </div>

        <CityPicker variant="site" className="hidden shrink-0 text-xs lg:inline-flex" />
      </div>
    </header>
  );
}
