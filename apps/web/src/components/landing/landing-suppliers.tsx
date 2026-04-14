import Image from 'next/image';
import Link from 'next/link';
import { landingAssets } from './assets';

function SupplierCard({ className }: { className?: string }) {
  return (
    <div
      className={`group h-[174px] bg-white px-4 py-6 lg:h-[185px] lg:px-[23px] lg:pb-0 lg:pt-[30px] ${className ?? ''}`}
    >
      <div className="flex flex-col gap-8 lg:gap-4">
        <div className="flex flex-col gap-2 lg:gap-1">
          <p className="break-words text-lg font-semibold leading-normal text-[#262e3f] lg:text-[21px]">
            ООО &ldquo;Ромашка и КО&rdquo;
          </p>
          <p className="text-sm leading-5 text-[#a7a7a7] lg:text-lg lg:leading-5">ИНН 1234567891</p>
        </div>
        <div className="inline-flex w-fit bg-brand px-4 py-3">
          <span className="text-xs font-semibold uppercase leading-5 text-white lg:text-lg lg:leading-5">
            10 товаров
          </span>
        </div>
      </div>
    </div>
  );
}

export function LandingSuppliers() {
  return (
    <section className="mx-auto mt-8 max-w-[1440px] px-4 pb-16 lg:mt-[49px] lg:px-12 lg:pb-24">
      <div className="mx-auto max-w-[1340px] space-y-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="max-w-[180px] text-2xl font-semibold uppercase leading-normal tracking-[-0.48px] text-[#262e3f] lg:max-w-none lg:text-[40px] lg:tracking-[-0.8px]">
            Популярные поставщики
          </h2>
          <Link
            href="/suppliers"
            className="flex shrink-0 items-center gap-2 uppercase text-[#262e3f] transition-opacity hover:opacity-80 active:opacity-70"
          >
            <span className="text-lg font-medium leading-normal tracking-[-0.36px] lg:text-[21px] lg:tracking-[-0.42px]">
              <span className="lg:hidden">Все</span>
              <span className="hidden lg:inline">Все поставщики</span>
            </span>
            <Image
              src={landingAssets.arrowRight}
              alt=""
              width={34}
              height={34}
              className="size-6 lg:size-[34px]"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5">
          <SupplierCard />
          <SupplierCard />
          <SupplierCard />
          <SupplierCard />
        </div>
      </div>
    </section>
  );
}
