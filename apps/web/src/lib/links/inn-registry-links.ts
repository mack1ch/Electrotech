/**
 * Внешние страницы справочников по ИНН. Форматы URL сервисов меняются;
 * при поломке ссылок сверяйте вручную в браузере.
 *
 * - Контур.Фокус: поиск по реквизитам через query.
 * - Чекко: /search?query=… редиректит на карточку при однозначном совпадении.
 * - ФНС (Прозрачный бизнес, pb.nalog.ru): страница поиска с параметром query (подстановка может зависеть от клиентского JS).
 * - Saby: стабильного публичного deep link с ИНН нет — открывается раздел проверки контрагентов.
 */

export function normalizeInnDigits(raw: string | null | undefined): string | null {
  if (raw == null || raw === '') {
    return null;
  }
  const d = String(raw).replace(/\D/g, '');
  if (d.length !== 10 && d.length !== 12) {
    return null;
  }
  return d;
}

function normLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function innSourceHrefForLabel(label: string, innDigits: string): string | null {
  const n = normLabel(label);
  const compact = n.replace(/\s/g, '');

  if (
    (n.includes('контур') && n.includes('фокус')) ||
    (/kontur/.test(n) && /focus|фокус/.test(n))
  ) {
    return `https://focus.kontur.ru/entity?query=${encodeURIComponent(innDigits)}`;
  }

  if (n === 'чекко' || n === 'checko' || n === 'checco' || compact === 'checko') {
    return `https://checko.ru/search?query=${encodeURIComponent(innDigits)}`;
  }

  if (n === 'фнс' || n.startsWith('фнс ') || n.endsWith(' фнс') || n.includes('прозрачный бизнес')) {
    return `https://pb.nalog.ru/search.html?query=${encodeURIComponent(innDigits)}`;
  }

  if (/^sab(b)?y$/i.test(compact) || n.includes('сбис')) {
    return 'https://saby.ru/profile/';
  }

  return null;
}

export function splitInnSourcesLine(line: string): string[] {
  return line
    .split(/\s*[·•|]\s*/u)
    .map((s) => s.trim())
    .filter(Boolean);
}
