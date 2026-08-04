import { parseDocument } from 'yaml';

export type FrontMatterData = Record<string, any>;

export function parseFrontMatter(source: string): {
  data: FrontMatterData;
  content: string;
} {
  const normalizedSource = source.replace(/^\uFEFF/, '');
  const match = normalizedSource.match(
    /^---[\t ]*\r?\n([\s\S]*?)\r?\n---[\t ]*(?:\r?\n|$)/,
  );

  if (!match) {
    return { data: {}, content: normalizedSource };
  }

  const document = parseDocument(match[1], {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });

  if (document.errors.length > 0) {
    throw document.errors[0];
  }

  const parsed = document.toJS({ maxAliasCount: 20 });
  const data = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed as FrontMatterData
    : {};

  return {
    data,
    content: normalizedSource.slice(match[0].length),
  };
}
