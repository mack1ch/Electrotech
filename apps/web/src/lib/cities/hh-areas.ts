/** Узел дерева регионов API HeadHunter (открытый JSON без ключа). */
export type HhAreaNode = {
  id: string;
  name: string;
  areas?: HhAreaNode[];
};

const RUSSIA_ROOT_ID = '113';

/** Собирает названия населённых пунктов (листья) внутри России. */
export function collectRussianCityNames(roots: HhAreaNode[]): string[] {
  const russia = roots.find((n) => n.id === RUSSIA_ROOT_ID);
  if (!russia?.areas?.length) return [];

  const names = new Set<string>();
  const walk = (node: HhAreaNode) => {
    const kids = node.areas ?? [];
    if (kids.length === 0) names.add(node.name);
    else for (const c of kids) walk(c);
  };
  for (const region of russia.areas) walk(region);

  return [...names].sort((a, b) => a.localeCompare(b, 'ru'));
}
