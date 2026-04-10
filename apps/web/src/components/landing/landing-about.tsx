import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@electrotech/ui';
import { landingAssets } from './assets';

/** Кнопки CTA — макет Figma 0:151 / 0:154: 406×, py 28 px 27, без скруглений и рамки. */
function CatalogButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center justify-between bg-[#f9fafb] px-[27px] py-7',
        'text-[19px] font-medium uppercase leading-[25px] text-[#262e3f]',
        'transition-[background-color,transform] duration-150 hover:bg-[#f0f3f7] active:scale-[0.99]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#264b82]',
        'lg:w-[406px] lg:max-w-[406px]',
      )}
    >
      {children}
      <Image src={landingAssets.ctaArrow} alt="" width={22} height={22} className="size-[22px] shrink-0" />
    </Link>
  );
}

type AboutVisual = {
  title: string;
  subtitle: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  panelHClass: string;
  /** Скругление внутреннего фрейма с картой (Figma 0:326). */
  imageRounded?: boolean;
};

const aboutVisuals: AboutVisual[] = [
  {
    title: 'Ищите поставщиков',
    subtitle: 'Кабель и электрооборудование — все в одном месте',
    src: landingAssets.aboutSearchSuppliers,
    width: 1024,
    height: 515,
    alt: 'Поиск поставщиков: поле запроса и таблица с предложениями по товару',
    panelHClass: 'lg:h-[418px]',
  },
  {
    title: 'Сравнивайте предложения',
    subtitle: 'Покажем лучшую цену',
    src: landingAssets.aboutCompareOffers,
    width: 1024,
    height: 516,
    alt: 'Сравнение предложений поставщиков: карточки с ценой и меткой «Лучшая цена»',
    panelHClass: 'lg:h-[418px]',
  },
  {
    title: 'Смотрите поставщиков поблизости',
    subtitle: 'И выбирайте лучших',
    src: landingAssets.aboutSuppliersMap,
    width: 1024,
    height: 509,
    alt: 'Карта с отметками поставщиков и карточкой контактов',
    panelHClass: 'lg:h-[435px]',
    imageRounded: true,
  },
];

export function LandingAbout() {
  return (
    <section className="relative bg-white">
      {/* Слабый «шум» scale-1 по макету 0:148; overflow только здесь — иначе ломается lg:sticky у текстовой колонки */}
      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        aria-hidden
      >
        <Image
          src={landingAssets.heroDecor}
          alt=""
          width={1600}
          height={1600}
          className="absolute left-1/2 top-1/2 max-w-none -translate-x-[40%] -translate-y-[55%] opacity-[0.06]"
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 py-14 lg:px-[50px] lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,520px)_636px] lg:gap-x-[184px] lg:gap-y-0">
          {/* Липкая колонка — 0:150 / 0:149 / кнопки */}
          <div className="max-w-[520px] space-y-6 lg:sticky lg:top-24 lg:z-10 lg:self-start">
            <h2 className="max-w-[390px] text-2xl font-semibold uppercase leading-normal tracking-[-0.48px] text-black lg:text-[40px] lg:tracking-[-0.8px]">
              О сайте электротехника
            </h2>
            <p className="max-w-[520px] text-sm font-medium leading-normal tracking-[-0.14px] text-[#252d3d] lg:text-xl lg:leading-[25px] lg:tracking-[-0.2px]">
              На сайте вы сможете найти нужных поставщиков или товары рядом, с понятными сроками доставки, и
              выбрать самый подходящий{' '}
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <CatalogButton href="/suppliers">В каталог поставщиков</CatalogButton>
              <CatalogButton href="/search">В каталог товаров</CatalogButton>
            </div>
          </div>

          {/* Карточки 0:157 / 0:211 / 0:322 — #f9fafb, 636px, интервал 12px */}
          <div className="flex min-w-0 flex-col gap-3">
            {aboutVisuals.map((block) => (
              <figure
                key={block.src}
                className={cn(
                  'flex min-h-0 flex-col overflow-hidden bg-[#f9fafb]',
                  block.panelHClass,
                )}
              >
                <figcaption className="flex min-h-[92px] shrink-0 flex-col justify-start space-y-2 px-[29px] pb-2 pt-6 lg:min-h-[118px] lg:pt-7">
                  <h3 className="text-base font-semibold uppercase leading-normal text-[#0a0a0a] lg:text-[21px]">
                    {block.title}
                  </h3>
                  <p className="text-sm font-normal leading-normal text-[#6a7282] lg:text-base">
                    {block.subtitle}
                  </p>
                </figcaption>
                {/* Белая панель: одни и те же отступы у всех карточек; скриншоты внутри не тянем под выравнивание контента */}
                <div className="flex min-h-0 flex-1 flex-col bg-white px-[29px] pb-6 lg:pb-7">
                  <div
                    className={cn(
                      'relative min-h-[200px] w-full flex-1 overflow-hidden bg-white lg:min-h-0',
                      block.imageRounded && 'rounded-lg',
                    )}
                  >
                    <Image
                      src={block.src}
                      alt={block.alt}
                      width={block.width}
                      height={block.height}
                      className="h-full w-full object-contain object-top"
                      sizes="(max-width: 1024px) 100vw, 636px"
                    />
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
