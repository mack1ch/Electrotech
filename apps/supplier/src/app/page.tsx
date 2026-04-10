import { Button } from '@electrotech/ui';

export default function SupplierHomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        apps/supplier
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Зона поставщика</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Отдельное Next.js-приложение для кабинета поставщика и администрирования. На этапе
        инициализации здесь только заглушка — без авторизации и продуктовой логики.
      </p>
      <div>
        <Button type="button">Кнопка из @electrotech/ui</Button>
      </div>
    </main>
  );
}
