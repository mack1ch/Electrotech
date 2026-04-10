'use client';

import Image from 'next/image';
import { useCallback, useId, useState } from 'react';
import { cn } from '@electrotech/ui';
import { landingAssets } from './assets';

const faqItems: { q: string; a: string }[] = [
  {
    q: 'Как гарантируете, что оборудование оригинальное, а не «серый» параллельный импорт или подделка?',
    a: 'Мы не продаём товары сами: на платформе представлены поставщики, которые указывают условия и происхождение. Уточняйте документы и сертификаты у выбранного поставщика до сделки.',
  },
  {
    q: 'Предоставляете ли вы сертификаты соответствия и паспорта на продукцию?',
    a: 'Комплект документов запрашивается у конкретного поставщика по выбранной позиции — состав и сроки зависят от их процессов.',
  },
  {
    q: 'Сколько стоит доставка по городу и в регионы?',
    a: 'Стоимость и сроки доставки задаёт поставщик и отображается в карточке предложения или уточняется при контакте.',
  },
  {
    q: 'Какая гарантия на оборудование?',
    a: 'Гарантийные обязательства определяются производителем и поставщиком. Сроки и условия лучше зафиксировать в договоре с выбранной компанией.',
  },
  {
    q: 'Помогаете ли вы с подбором аналогов, если нужной модели нет в наличии?',
    a: 'Используйте поиск и сравнение предложений по параметрам и цене. Техническую замену и аналоги согласуйте с инженерами поставщика.',
  },
  {
    q: 'Работаете ли вы с проектами промышленных объектов или только с квартирами/коттеджами?',
    a: 'В каталоге есть поставщики с разным профилем — от розницы до проектных поставок. Фильтры и контакты помогут найти подходящего партнёра.',
  },
  {
    q: 'Консультируете ли по вопросам совместимости оборудования разных брендов?',
    a: 'Совместимость и схемы подключения подтверждает поставщик или производитель. Мы рекомендуем запросить расчёт и спецификацию у выбранного продавца.',
  },
];

export function LandingFaq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="bg-[#f4f5f9] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto flex max-w-[1340px] flex-col gap-10 lg:flex-row lg:gap-[120px]">
        <h2 className="shrink-0 text-2xl font-semibold uppercase leading-normal tracking-[-0.48px] text-black lg:pt-1 lg:text-[40px] lg:tracking-[-0.8px]">
          Частые вопросы
        </h2>
        <ul className="min-w-0 flex-1 space-y-0">
          {faqItems.map(({ q, a }, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-trigger-${index}`;

            return (
              <li
                key={q}
                className="border-b border-[rgba(38,75,130,0.28)] last:border-b-0 lg:border-solid"
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full gap-4 py-8 text-left lg:min-h-[85px] lg:items-center lg:py-6"
                  >
                    <span className="min-w-0 flex-1 text-xl leading-normal text-black lg:max-w-[711px] lg:text-[20.1px] lg:leading-9">
                      {q}
                    </span>
                    <span
                      className={cn(
                        'relative mt-1 size-8 shrink-0 rounded-sm border border-transparent bg-white transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out',
                        'hover:border-brand/20 hover:shadow-sm lg:mt-0',
                        isOpen && 'border-brand/15 shadow-sm',
                      )}
                      aria-hidden
                    >
                      <Image
                        src={landingAssets.faqPlus}
                        alt=""
                        width={12}
                        height={12}
                        className={cn(
                          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 ease-out motion-reduce:duration-0',
                          'transition-transform motion-reduce:transition-none',
                          isOpen && 'rotate-45',
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  className={cn(
                    'grid duration-300 ease-out motion-reduce:duration-0',
                    'transition-[grid-template-rows] motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      aria-hidden={!isOpen}
                      className={cn(
                        'border-t border-transparent pb-8 pt-0 text-base leading-relaxed text-[#4a5565] lg:max-w-[711px] lg:pb-6 lg:pr-12 lg:text-lg lg:leading-8',
                        'transition-opacity duration-300 ease-out motion-reduce:transition-none',
                        isOpen ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      {a}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
