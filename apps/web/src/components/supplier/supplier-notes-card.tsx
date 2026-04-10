'use client';

import { useEffect, useState } from 'react';

function storageKey(slug: string): string {
  return `electrotech:supplier-notes:${slug}`;
}

export function SupplierNotesCard({ supplierSlug, className }: { supplierSlug: string; className?: string }) {
  const [value, setValue] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(supplierSlug));
      setValue(raw ?? '');
    } catch {
      setValue('');
    }
    setHydrated(true);
  }, [supplierSlug]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    try {
      localStorage.setItem(storageKey(supplierSlug), value);
    } catch {
      /* ignore */
    }
  }, [supplierSlug, value, hydrated]);

  return (
    <aside
      className={`rounded-lg bg-white px-[23px] py-6 shadow-sm lg:min-h-[200px] lg:py-6 ${className ?? ''}`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-ink lg:text-[21px]">Заметки о поставщике</h2>
        <p className="text-sm leading-5 text-[#a7a7a7]">Видны только вам</p>
      </div>
      <label className="mt-2 block">
        <span className="sr-only">Заметка</span>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите заметку"
          rows={6}
          className="mt-2 min-h-[118px] w-full resize-y rounded border-0 bg-[#f9fafb] px-[13px] py-[9px] text-base leading-5 text-ink placeholder:text-[#a7a7a7] focus:outline-none focus:ring-2 focus:ring-brand/30 lg:min-h-[280px]"
        />
      </label>
    </aside>
  );
}
