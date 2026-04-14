'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';

export function useNavigationPending() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isTransitionPending, startTransition] = useTransition();
  const routeKey = useMemo(
    () => `${pathname ?? ''}?${searchParams?.toString() ?? ''}`,
    [pathname, searchParams],
  );

  useEffect(() => {
    setPendingKey(null);
  }, [routeKey]);

  const runNavigation = (key: string, fn: () => void) => {
    setPendingKey(key);
    startTransition(fn);
  };

  const isPending = (key?: string) => {
    if (pendingKey == null) {
      return false;
    }
    if (key != null) {
      return pendingKey === key;
    }
    return isTransitionPending;
  };

  return {
    pendingKey,
    isTransitionPending,
    runNavigation,
    isPending,
  };
}
