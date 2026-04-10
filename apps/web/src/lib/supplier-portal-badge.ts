/**
 * Значок поля «На портале» у поставщика (Figma: 25:329, 25:337, 25:345).
 *
 * - verified — «печать» бронза/оранж: проверенный партнёр (долго на площадке).
 * - active — жёлтый круг: стабильный поставщик, средний срок.
 * - new — светлая печать с диагональю: новичок или короткий срок на портале.
 */

export type SupplierPortalBadge = 'verified' | 'active' | 'new';

export const PORTAL_BADGE_LABELS: Record<SupplierPortalBadge, string> = {
  verified: 'Проверенный партнёр',
  active: 'Активный поставщик',
  new: 'Новый на портале',
};

export function resolveSupplierPortalBadge(card: {
  onPortalBadge: SupplierPortalBadge | null;
  onPortalSince: string | null;
}): SupplierPortalBadge {
  if (card.onPortalBadge) {
    return card.onPortalBadge;
  }
  const s = card.onPortalSince ?? '';
  const yearsM = s.match(/(\d+)\s*(?:год|года|лет)\b/);
  if (yearsM?.[1]) {
    const y = Number.parseInt(yearsM[1], 10);
    if (y >= 2) {
      return 'verified';
    }
    if (y >= 1) {
      return 'active';
    }
  }
  if (/мес/.test(s)) {
    const mm = s.match(/(\d+)\s*мес/);
    if (mm?.[1] && Number.parseInt(mm[1], 10) < 12) {
      return 'new';
    }
    return 'active';
  }
  if (!s || s === '—') {
    return 'new';
  }
  return 'active';
}
