import type { SupplierPortalBadge } from '@/lib/supplier-portal-badge';
import { PORTAL_BADGE_LABELS } from '@/lib/supplier-portal-badge';

const size = 20;

/** Иконки статуса «На портале» по макетам Figma (25:329, 25:337, 25:345). */
export function SupplierPortalBadgeIcon({
  badge,
  className,
}: {
  badge: SupplierPortalBadge;
  className?: string;
}) {
  const title = PORTAL_BADGE_LABELS[badge];
  const common = { width: size, height: size, role: 'img' as const, 'aria-label': title };

  if (badge === 'verified') {
    return (
      <svg {...common} viewBox="0 0 20 20" fill="none" className={className}>
        <title>{title}</title>
        <circle cx="10" cy="10" r="9" fill="#D97706" stroke="#9A3412" strokeWidth="1" />
        <path
          d="M10 3.2 14.2 6.8v6.4L10 16.8 5.8 13.2V6.8L10 3.2z"
          fill="none"
          stroke="#FFFBEB"
          strokeWidth="0.85"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (badge === 'active') {
    return (
      <svg {...common} viewBox="0 0 20 20" fill="none" className={className}>
        <title>{title}</title>
        <circle cx="10" cy="10" r="8.25" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
        <circle cx="10" cy="10" r="3" fill="#FEF9C3" opacity="0.95" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="0 0 20 20" fill="none" className={className}>
      <title>{title}</title>
      <circle cx="10" cy="10" r="8.5" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1" />
      <path
        d="M5.5 5.5c.35-.35.9-.35 1.25 0l8 8c.35.35.35.9 0 1.25s-.9.35-1.25 0l-8-8c-.35-.35-.35-.9 0-1.25z"
        fill="#6B7280"
      />
    </svg>
  );
}
