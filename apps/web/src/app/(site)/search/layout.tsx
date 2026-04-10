import type { ReactNode } from 'react';

export default function SearchLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-[#f4f5f9]">{children}</div>;
}
