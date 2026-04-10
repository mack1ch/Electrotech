import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/service/site-header';

export default function SiteShellLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
