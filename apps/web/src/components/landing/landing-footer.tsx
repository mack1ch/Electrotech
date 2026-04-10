import Image from 'next/image';
import Link from 'next/link';
import { landingAssets } from './assets';

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-white pb-8 pt-16 lg:min-h-[591px] lg:pb-12 lg:pt-8">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-12">
        <p className="mb-10 font-black text-2xl uppercase leading-5 tracking-[0.48px] text-[#0a0a0a] lg:mb-12 lg:mt-12">
          Электротехника
        </p>

        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <nav
            className="flex flex-col gap-12 font-semibold uppercase leading-5 tracking-[0.28px] text-[#6e6e6e] lg:flex-row lg:gap-16"
            aria-label="Нижнее меню"
          >
            <div className="flex flex-col gap-2">
              <Link href="/search" className="w-fit hover:text-ink">
                Покупателям
              </Link>
              <Link href="/suppliers" className="w-fit hover:text-ink">
                Поставщикам
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="w-fit">Контакты</span>
              <span className="w-fit">Документы</span>
            </div>
          </nav>
          <div className="flex flex-col gap-2 text-base text-brand">
            <a href="tel:+79999999999" className="font-semibold hover:opacity-90">
              +7(999)-999-99-99
            </a>
            <a href="mailto:pochta@mail.ru" className="font-semibold hover:opacity-90">
              pochta@mail.ru
            </a>
          </div>
        </div>

        <div className="mt-16 space-y-3 lg:mt-28">
          <Image
            src={landingAssets.dividerLine}
            alt=""
            width={1336}
            height={1}
            className="h-px w-full max-w-[1336px]"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase leading-5 tracking-[0.24px] text-[#bbb] lg:text-sm lg:tracking-[0.28px]">
            <span>made by inverse</span>
            <Link href="/" className="text-center">
              Публичная оферта
            </Link>
            <span>2026</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-10 flex w-full justify-center overflow-x-hidden lg:mt-6">
        <Image
          src={landingAssets.footerWordmark}
          alt=""
          width={1407}
          height={97}
          className="h-[72px] w-full max-w-[1407px] object-cover object-bottom lg:h-[97px]"
        />
      </div>
    </footer>
  );
}
