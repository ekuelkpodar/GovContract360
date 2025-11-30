// Simple parser for power search syntax like agency:"Department of Defense" value>5000000 deadline<2025-01-01
export interface ParsedQuery {
  text: string;
  filters: Record<string, any>;
}

const valueRegex = /(\w+):"([^"]+)"|(\w+):(\S+)|(\w+)([<>]=?)(\S+)/g;

export function parseQuery(raw: string): ParsedQuery {
  const filters: Record<string, any> = {};
  let textTokens: string[] = [];
  let match: RegExpExecArray | null;
  const consumed = new Set<string>();

  while ((match = valueRegex.exec(raw)) !== null) {
    const [full, keyQuoted, valueQuoted, keySimple, valueSimple, keyCompare, operator, compareValue] = match;
    if (keyQuoted) {
      filters[keyQuoted] = valueQuoted;
      consumed.add(full);
    } else if (keySimple) {
      filters[keySimple] = valueSimple;
      consumed.add(full);
    } else if (keyCompare) {
      const numericValue = Number(compareValue.replace(/[^0-9.]/g, ''));
      const rangeKey = keyCompare.toLowerCase().includes('value') ? 'value' : keyCompare;
      filters[rangeKey] = filters[rangeKey] || {};
      filters[rangeKey][operator] = Number.isNaN(numericValue) ? compareValue : numericValue;
      consumed.add(full);
    }
  }

  const tokens = raw.split(/\s+/);
  textTokens = tokens.filter((token) => !Array.from(consumed).some((c) => c.includes(token)));

  return { text: textTokens.join(' ').trim(), filters };
}
