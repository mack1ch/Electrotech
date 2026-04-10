import Image from 'next/image';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { CityPicker } from '@/components/city-picker';
import { landingAssets } from './assets';

const navItemBase =
  'text-center text-base uppercase leading-[25px] transition-[opacity,color] duration-150';

const navItemActive = `${navItemBase} shrink-0 font-bold text-white`;

const navItemInactive = `${navItemBase} shrink-0 font-normal text-white/75 hover:text-white`;

export function LandingHeader() {
  return (
    <header className="relative z-20 shrink-0 border-b border-black/10 lg:border-b-0">
      <div className="relative mx-auto flex h-[60px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 lg:h-[109px] lg:px-12">
        <div className="flex items-center gap-4 lg:gap-[34px]">
          <Link
            href="/"
            className="text-sm font-bold uppercase leading-[12.87px] tracking-[0.28px] text-white transition-opacity duration-150 hover:opacity-90 lg:text-2xl lg:leading-5 lg:tracking-[0.48px]"
          >
            Электротехника
          </Link>
          <div className="hidden h-5 w-px shrink-0 bg-white opacity-30 lg:block" aria-hidden />
          <nav className="hidden min-w-0 items-center lg:flex lg:gap-9" aria-label="Основная навигация">
            <Link href="/" className={navItemActive} aria-current="page">
              Главная
            </Link>
            <Link href="/suppliers" className={navItemInactive}>
              Каталог Поставщиков
            </Link>
            <Link href="/search" className={navItemInactive}>
              Каталог товаров
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/search"
            className="flex size-10 items-center justify-center rounded-[10px] bg-brand transition-[transform,background-color,box-shadow] duration-150 hover:bg-[#1f3d68] hover:shadow-md active:scale-[0.97]"
            aria-label="Каталог товаров"
          >
            <LayoutGrid className="size-6 text-white" strokeWidth={1.75} aria-hidden />
          </Link>
          <CityPicker variant="landing" className="lg:hidden" />
        </div>

        <CityPicker variant="landing" className="hidden lg:inline-flex" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden px-12 lg:block">
        <div className="mx-auto max-w-[1440px]">
          <Image
            src={landingAssets.headerRule}
            alt=""
            width={1340}
            height={1}
            className="h-px w-full max-w-[1340px]"
          />
        </div>
      </div>
    </header>
  );
}
