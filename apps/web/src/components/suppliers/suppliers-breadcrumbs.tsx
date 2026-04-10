'use client';

import { Breadcrumb } from 'antd';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

/** Хлебные крошки в стиле страницы поиска (Figma DEV — каталог). */
export function SuppliersBreadcrumbs() {
  return (
    <nav aria-label="Хлебные крошки">
      <Breadcrumb
        className="text-xs leading-normal text-[#4a5565] [&_.ant-breadcrumb-link]:leading-normal [&_.ant-breadcrumb-ol]:mb-0 [&_.ant-breadcrumb-ol]:flex [&_.ant-breadcrumb-ol]:flex-wrap [&_.ant-breadcrumb-ol]:items-center [&_.ant-breadcrumb-separator]:mx-0.5 [&_.ant-breadcrumb-separator]:!inline-flex [&_.ant-breadcrumb-separator]:!items-center lg:text-sm lg:leading-6 [&_.ant-breadcrumb-link]:lg:leading-6"
        separator={
          <ChevronRight
            className="size-4 shrink-0 text-[#4a5565] lg:size-6"
            strokeWidth={1.75}
            aria-hidden
          />
        }
        items={[
          {
            title: (
              <Link href="/" className="font-normal text-[#4a5565] hover:underline">
                Главная
              </Link>
            ),
          },
          { title: <span className="font-normal text-brand">Каталог поставщиков</span> },
        ]}
      />
    </nav>
  );
}
