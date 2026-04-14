'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

export function useNavigationPending() {
  const pathname = usePathname();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isTransitionPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPendingKey(null);
  }, [pathname]);

  const runNavigation = (key: string, fn: () => void) => {
    setPendingKey(key);
    startTransition(fn);
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    // Query-only navigation does not always change pathname; avoid sticky loading.
    timeoutRef.current = setTimeout(() => {
      setPendingKey((current) => (current === key ? null : current));
      timeoutRef.current = null;
    }, 2000);
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
