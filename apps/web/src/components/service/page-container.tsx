import type { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-content bg-[#f4f5f9] px-4 pb-10 pt-3 sm:px-6 lg:bg-transparent lg:px-9 lg:pb-8 lg:pt-8">
      {children}
    </div>
  );
}
