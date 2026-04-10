import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { electrotechAntTheme } from '@/theme/antd-electrotech';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Электротехника',
  description: 'Каталог электротехнической продукции и поставщиков.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} min-h-screen font-sans`}>
        <AntdRegistry>
          <ConfigProvider locale={ruRU} theme={electrotechAntTheme}>
            <div className="flex min-h-screen flex-col">{children}</div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
