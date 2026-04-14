import Image from 'next/image';
import { landingAssets } from './assets';
import { LandingAbout } from './landing-about';
import { LandingFaq } from './landing-faq';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';
import { LandingHeroSearch } from './landing-hero-search';
import { LandingSuppliers } from './landing-suppliers';

/** Нативные размеры scale-1.svg (центр композиции ≈ центру viewBox 1581×1976) */
const HERO_DECOR_WIDTH = 1581;
const HERO_DECOR_HEIGHT = 1976;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f9] text-[#0a0a0a] antialiased">
      <div className="relative min-h-[460px] overflow-hidden lg:min-h-[504px]">
        <div
          className="absolute inset-x-0 top-0 h-[460px] bg-[#262e3f] lg:h-[504px]"
          aria-hidden
        />
        {/* Лёгкое размытие по макету Figma (0:30) поверх фона */}
        <div
          className="pointer-events-none absolute left-[-54px] top-[63px] hidden h-[min(468px,100%)] w-[min(1494px,calc(100%+108px))] backdrop-blur-[8px] lg:block lg:h-[514px]"
          aria-hidden
        />
        {/* Декоративная сетка: центр по горизонтали и вертикали полосы героя, крупнее высоты блока — обрезка по краям */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px] overflow-hidden lg:h-[504px]"
          aria-hidden
        >
          <Image
            src={landingAssets.heroDecor}
            alt=""
            width={HERO_DECOR_WIDTH}
            height={HERO_DECOR_HEIGHT}
            priority
            className="absolute left-1/2 top-1/2 h-auto w-[min(1581px,200vw)] max-w-none -translate-x-[40%] -translate-y-1/2 select-none object-contain sm:w-[min(1581px,165vw)] lg:-translate-x-[38%] lg:w-[min(1581px,125vw)]"
            sizes="(max-width: 640px) 200vw, (max-width: 1024px) 165vw, min(1581px, 125vw)"
          />
        </div>

        <div className="relative z-10">
          <LandingHeader />
          {/* Отступ под заголовок: центр блока ~231px от верха страницы при высоте шапки 109px (макет 0:28 / 0:73) */}
          <div className="mx-auto max-w-[1440px] px-4 pb-[120px] pt-[118px] lg:px-[50px] lg:pb-20 lg:pt-[54px]">
            <h1 className="max-w-[20ch] text-[40px] font-semibold uppercase leading-[1.14] tracking-[-1.6px] text-white lg:max-w-[830px] lg:text-[60.705px] lg:leading-[1.14] lg:tracking-[-2.4282px]">
              Найдите идеального
              <br />
              поставщика
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-[126px] px-0 pb-12 sm:-mt-[118px] lg:-mt-[108px] lg:pb-20">
        <LandingHeroSearch />
      </div>

      <LandingSuppliers />
      <LandingAbout />
      <LandingFaq />
      <LandingFooter />
    </div>
  );
}
