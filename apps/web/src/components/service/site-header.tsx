'use client';

import { ChevronDown, LayoutGrid, LoaderCircle, QrCode, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@electrotech/ui';
import { CityPicker } from '@/components/city-picker';
import { useNavigationPending } from '@/lib/ui/use-navigation-pending';

const catalogRootItems = ['Поставщики', 'Товары'] as const;

type CatalogCategory = {
  name: string;
  subcategories: string[];
};

const catalogTree: Record<
  (typeof catalogRootItems)[number],
  {
    categories: CatalogCategory[];
  }
> = {
  Товары: {
    categories: [
      {
        name: 'Кабель и провод',
        subcategories: [
          'Силовые кабели',
          'Контрольные кабели',
          'Монтажные провода',
          'Огнестойкий кабель',
          'СИП',
          'Кабельная арматура',
        ],
      },
      {
        name: 'Электрооборудование',
        subcategories: [
          'Автоматические выключатели',
          'УЗО и дифавтоматы',
          'Контакторы',
          'Пускатели',
          'Реле',
          'Источники питания',
        ],
      },
      {
        name: 'Распределительные устройства',
        subcategories: [
          'Щиты ГРЩ',
          'Щиты ВРУ',
          'Шкафы управления',
          'КРУ',
          'Модульные шкафы',
          'Комплектующие щитов',
        ],
      },
      {
        name: 'Светотехника',
        subcategories: [
          'Промышленные светильники',
          'Уличные светильники',
          'Прожекторы',
          'Светодиодные ленты',
          'Опоры и кронштейны',
          'Системы аварийного освещения',
        ],
      },
      {
        name: 'Электроустановочные изделия',
        subcategories: [
          'Розетки',
          'Выключатели',
          'Рамки и механизмы',
          'Кабель-каналы',
          'Коробки монтажные',
          'Аксессуары',
        ],
      },
    ],
  },
  Поставщики: {
    categories: [
      {
        name: 'Все поставщики',
        subcategories: [
          'Кабельные заводы',
          'Дистрибьюторы',
          'Щитовое производство',
          'Светотехнические компании',
          'Проектные поставщики',
          'Региональные партнеры',
        ],
      },
      {
        name: 'Кабель',
        subcategories: [
          'Силовой кабель',
          'Монтажный кабель',
          'Кабельная арматура',
          'Импортные бренды',
          'Российские бренды',
          'Под заказ',
        ],
      },
      {
        name: 'Электрооборудование',
        subcategories: [
          'Низковольтное',
          'Высоковольтное',
          'Автоматика',
          'Реле и пускатели',
          'Шкафная сборка',
          'Комплектующие',
        ],
      },
      {
        name: 'Светотехника',
        subcategories: [
          'Промышленный свет',
          'Уличный свет',
          'Офисный свет',
          'Складской свет',
          'Архитектурный свет',
          'LED-решения',
        ],
      },
    ],
  },
};

export function SiteHeader() {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const isSuppliersSection = pathname.startsWith('/suppliers');
  const catalogLabel = isSuppliersSection ? 'Поставщики' : 'Товары';
  const searchFormAction = isSuppliersSection ? '/suppliers' : '/search';
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [activeRoot, setActiveRoot] = useState<(typeof catalogRootItems)[number]>('Товары');
  const [activeCategory, setActiveCategory] = useState<string>(catalogTree.Товары.categories[0]?.name ?? '');
  const headerRef = useRef<HTMLElement | null>(null);
  const sectionMenuRef = useRef<HTMLDivElement | null>(null);
  const { runNavigation, isPending } = useNavigationPending();
  const sectionPending = isPending('header-section-switch');
  const searchPending = isPending('header-search-submit');

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsCatalogOpen(false);
      }
    }

    function onPointerDown(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) {
        setIsCatalogOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!sectionMenuRef.current?.contains(e.target as Node)) {
        setIsSectionMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSectionMenuOpen(false);
  }, [pathname]);

  const activeTree = catalogTree[activeRoot];
  const activeCategoryEntry =
    activeTree.categories.find((category) => category.name === activeCategory) ?? activeTree.categories[0] ?? null;
  const columns =
    activeCategoryEntry == null
      ? []
      : [
          activeCategoryEntry.subcategories.slice(0, 2),
          activeCategoryEntry.subcategories.slice(2, 4),
          activeCategoryEntry.subcategories.slice(4, 6),
        ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-black/10 bg-white lg:relative lg:top-auto lg:z-auto lg:border-neutral-200"
    >
      {/* Мобильная полоса: компактная высота */}
      <div className="mx-auto flex h-[60px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:hidden">
        <Link
          href="/"
          className="text-xs font-black uppercase leading-3 tracking-[0.24px] text-ink sm:text-[13px] sm:leading-[13px]"
        >
          Электротехника
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className={cn(
            'flex size-9 items-center justify-center rounded-[9px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1',
            isMobileMenuOpen ? 'bg-[#e5efff] text-brand' : 'bg-brand text-white',
          )}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-header-menu"
        >
          {isMobileMenuOpen ? (
            <X className="size-[21px]" strokeWidth={2} aria-hidden />
          ) : (
            <LayoutGrid className="size-[18px]" strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <>
          <div className="fixed inset-0 z-[70] bg-black/15 lg:hidden" aria-hidden onClick={() => setIsMobileMenuOpen(false)} />
          <div
            id="mobile-header-menu"
            className="fixed inset-x-0 top-[60px] z-[80] border-t border-neutral-200 bg-white px-8 py-8 shadow-sm lg:hidden"
          >
            <nav className="space-y-1" aria-label="Мобильная навигация">
              <Link
                href="/suppliers"
                className={cn(
                  'flex h-[41px] items-center rounded-[10px] px-4 text-sm text-ink',
                  isSuppliersSection ? 'bg-[#f4f5f9] font-normal' : 'bg-white font-normal',
                )}
              >
                Поставщики
              </Link>
              <Link
                href="/search"
                className={cn(
                  'flex h-[41px] items-center rounded-[10px] px-4 text-sm',
                  !isSuppliersSection ? 'bg-[#e5efff] font-semibold text-brand' : 'bg-white text-ink',
                )}
              >
                Товары
              </Link>
            </nav>
          </div>
        </>
      ) : null}

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
          <button
            type="button"
            onClick={() => setIsCatalogOpen((prev) => !prev)}
            className={cn(
              'inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1f3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#17355f] sm:h-11 lg:rounded-sm',
              isCatalogOpen && 'bg-[#1f3d68]',
            )}
            aria-expanded={isCatalogOpen}
            aria-haspopup="dialog"
            aria-label="Открыть каталог"
          >
            <QrCode className="size-3 text-white" strokeWidth={2} aria-hidden />
            Каталог
          </button>

          <form
            action={searchFormAction}
            method="get"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = String(formData.get('q') ?? '').trim();
              runNavigation('header-search-submit', () => {
                router.push(`${searchFormAction}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
              });
            }}
            className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 rounded-lg border-2 border-brand px-1.5 py-1 sm:min-h-11 sm:px-2 sm:py-1.5"
          >
            <div className="relative shrink-0" ref={sectionMenuRef}>
              <button
                type="button"
                onClick={() => setIsSectionMenuOpen((prev) => !prev)}
                className="flex list-none items-center gap-2 rounded-md bg-brand-muted px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-[#dce9ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:bg-[#d2e3ff] sm:text-sm"
                aria-haspopup="menu"
                aria-expanded={isSectionMenuOpen}
                aria-label="Выбор раздела поиска"
                disabled={sectionPending}
              >
                {catalogLabel}
                {sectionPending ? (
                  <LoaderCircle className="size-4 animate-spin text-brand" strokeWidth={1.9} aria-hidden />
                ) : (
                  <ChevronDown className="size-4 text-brand" strokeWidth={1.75} aria-hidden />
                )}
              </button>
              {isSectionMenuOpen ? (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-md border border-neutral-200 bg-white py-1 shadow-md">
                  <Link
                    href="/search"
                    className={cn(
                      'block px-3 py-2 text-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-inset',
                      !isSuppliersSection ? 'bg-neutral-50 font-semibold text-ink' : 'text-ink',
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSectionMenuOpen(false);
                      runNavigation('header-section-switch', () => {
                        router.push('/search');
                      });
                    }}
                  >
                    Товары
                  </Link>
                  <Link
                    href="/suppliers"
                    className={cn(
                      'block px-3 py-2 text-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-inset',
                      isSuppliersSection ? 'bg-neutral-50 font-semibold text-ink' : 'text-ink',
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSectionMenuOpen(false);
                      runNavigation('header-section-switch', () => {
                        router.push('/suppliers');
                      });
                    }}
                  >
                    Поставщики
                  </Link>
                </div>
              ) : null}
            </div>
            <input
              name="q"
              type="search"
              placeholder="Поиск"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:text-[15px]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 text-brand transition-colors hover:text-[#1d3f6f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 active:text-[#18345b] disabled:pointer-events-none disabled:opacity-45"
              aria-label="Искать"
              disabled={searchPending}
              aria-busy={searchPending}
            >
              {searchPending ? (
                <LoaderCircle className="size-5 animate-spin" strokeWidth={1.9} aria-hidden />
              ) : (
                <Search className="size-5" strokeWidth={2} aria-hidden />
              )}
            </button>
          </form>
        </div>

        <CityPicker variant="site" className="hidden shrink-0 text-xs lg:inline-flex" />
      </div>

      {isCatalogOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 hidden bg-black/15 lg:block"
            aria-label="Закрыть каталог"
            onClick={() => setIsCatalogOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-50 hidden border-t border-[#e0e0e0] bg-white lg:block">
            <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-8 py-6">
              <div className="w-[253px] space-y-1">
                {catalogRootItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setActiveRoot(item);
                      setActiveCategory(catalogTree[item].categories[0]?.name ?? '');
                    }}
                    className={cn(
                      'flex h-[41px] w-full items-center justify-between rounded-[10px] px-4 text-sm',
                      activeRoot === item
                        ? 'bg-[#e5efff] font-semibold text-[#264b82]'
                        : 'text-[#0a0a0a] hover:bg-[#f4f7fc]',
                    )}
                  >
                    {item}
                    <ChevronDown className="-rotate-90 size-4" aria-hidden />
                  </button>
                ))}
              </div>

              <div className="h-[417px] w-px bg-[#f9fafb]" aria-hidden />

              <div className="w-[253px] space-y-1">
                {activeTree.categories.map((item, index) => (
                  <button
                    key={`${item.name}-${index}`}
                    type="button"
                    onClick={() => setActiveCategory(item.name)}
                    className={cn(
                      'flex min-h-[41px] w-full items-center justify-between rounded-[10px] px-4 py-3 text-left text-sm',
                      activeCategory === item.name
                        ? 'bg-[#e5efff] font-semibold text-[#264b82]'
                        : 'text-[#0a0a0a] hover:bg-[#f4f7fc]',
                    )}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="-rotate-90 size-4 shrink-0" aria-hidden />
                  </button>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="mb-5 text-[21px] font-semibold leading-[25px] text-[#0a0a0a]">
                  {activeCategoryEntry?.name ?? 'Каталог'}
                </h3>
                <div className="grid grid-cols-3 gap-x-10 gap-y-6">
                  {columns.map((items, idx) => (
                    <div key={`column-${idx}`} className="space-y-2">
                      <p className="text-base font-semibold leading-[19px] text-[#0a0a0a]">Подкатегория</p>
                      <ul className="space-y-1 text-sm text-[#8d8d8d]">
                        {items.map((subcategory) => (
                          <li key={subcategory}>
                            <Link
                              href={`/search?q=${encodeURIComponent(subcategory)}`}
                              className="hover:text-[#264b82]"
                              onClick={() => setIsCatalogOpen(false)}
                            >
                              {subcategory}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {columns.length === 0 ? (
                    <p className="col-span-3 text-sm text-[#8d8d8d]">Категории пока недоступны.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
