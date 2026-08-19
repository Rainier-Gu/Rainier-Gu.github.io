import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options } from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import katex from 'katex';

type MarkdownAstNode = {
  type: string;
  depth?: number;
  value?: string;
  alt?: string;
  url?: string;
  title?: string | null;
  data?: Record<string, unknown>;
  position?: {
    start?: { offset?: number };
    end?: { offset?: number };
  };
  children?: MarkdownAstNode[];
};

type RenderMarkdownOptions = {
  numberHeadings?: boolean;
};

export type MarkdownTocItem = {
  level: number;
  text: string;
  html: string;
  id: string;
};

const codeAttributes = defaultSchema.attributes?.code || [];
const imageAttributes = defaultSchema.attributes?.img || [];

const markdownSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...codeAttributes,
      ['className', /^language-[\w-]+$/, 'math-inline', 'math-display'],
    ],
    img: [
      ...imageAttributes,
      ['className', 'article-image', 'article-image-center'],
      ['loading', 'lazy'],
      ['decoding', 'async'],
    ],
  },
} as Options;

const OBSIDIAN_IMAGE_PATTERN = /!\[\[([^\]\r\n]+)\]\]/g;
const SUPPORTED_IMAGE_EXTENSION = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

function createObsidianImageNode(rawEmbed: string): MarkdownAstNode | null {
  const [rawTarget, ...rawOptions] = rawEmbed.split('|');
  let target = rawTarget.trim().replace(/\\/g, '/');
  let alignment = 'center';

  target = target.replace(/#pic(?:[:_-])(center|left|right)$/i, (_match, value: string) => {
    alignment = value.toLowerCase();
    return '';
  });

  if (!SUPPORTED_IMAGE_EXTENSION.test(target)) return null;

  if (target.startsWith('public/')) target = target.slice('public'.length);
  if (!/^(?:https?:)?\/\//i.test(target) && !target.startsWith('/')) {
    target = target.includes('/') ? `/${target}` : `/assets/img/posts/${target}`;
  }

  const widthOption = rawOptions.find((option) => /^\d{1,4}$/.test(option.trim()));
  const width = widthOption ? Number.parseInt(widthOption.trim(), 10) : undefined;
  const fileName = target.split('/').pop() || 'article image';
  const alt = fileName.replace(/\.[^.]+$/, '');
  const className = ['article-image'];
  if (alignment === 'center') className.push('article-image-center');

  return {
    type: 'image',
    url: target,
    alt,
    title: null,
    data: {
      hProperties: {
        className,
        ...(width ? { width } : {}),
        loading: 'lazy',
        decoding: 'async',
      },
    },
  };
}

function remarkObsidianImageEmbeds() {
  return (tree: unknown) => {
    const transform = (parent: MarkdownAstNode) => {
      if (!parent.children?.length) return;

      const nextChildren: MarkdownAstNode[] = [];

      parent.children.forEach((child) => {
        if (child.type !== 'text' || typeof child.value !== 'string') {
          transform(child);
          nextChildren.push(child);
          return;
        }

        let cursor = 0;
        let match: RegExpExecArray | null;
        OBSIDIAN_IMAGE_PATTERN.lastIndex = 0;

        while ((match = OBSIDIAN_IMAGE_PATTERN.exec(child.value)) !== null) {
          const imageNode = createObsidianImageNode(match[1]);
          if (!imageNode) continue;

          if (match.index > cursor) {
            nextChildren.push({
              ...child,
              value: child.value.slice(cursor, match.index),
            });
          }

          nextChildren.push(imageNode);
          cursor = match.index + match[0].length;
        }

        if (cursor === 0) {
          nextChildren.push(child);
        } else if (cursor < child.value.length) {
          nextChildren.push({
            ...child,
            value: child.value.slice(cursor),
          });
        }
      });

      parent.children = nextChildren;
    };

    transform(tree as MarkdownAstNode);
  };
}

function visitHeadings(
  node: MarkdownAstNode,
  visitor: (heading: MarkdownAstNode & { depth: number }) => void,
) {
  if (node.type === 'heading' && typeof node.depth === 'number') {
    visitor(node as MarkdownAstNode & { depth: number });
  }

  node.children?.forEach((child) => visitHeadings(child, visitor));
}

function getHeadingText(node: MarkdownAstNode): string {
  if (node.type === 'image') return node.alt || '';
  if (node.type === 'inlineMath') return node.value ? `$${node.value}$` : '';
  if (typeof node.value === 'string') {
    return node.type === 'html'
      ? node.value.replace(/<\/?[^>]+(>|$)/g, '')
      : node.value;
  }

  return node.children?.map(getHeadingText).join('') || '';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getHeadingHtml(node: MarkdownAstNode): string {
  if (node.type === 'image') return escapeHtml(node.alt || '');
  if (node.type === 'inlineMath') {
    return katex.renderToString(node.value || '', {
      displayMode: false,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
    });
  }
  if (typeof node.value === 'string') {
    const value = node.type === 'html'
      ? node.value.replace(/<\/?[^>]+(>|$)/g, '')
      : node.value;
    return escapeHtml(value);
  }

  return node.children?.map(getHeadingHtml).join('') || '';
}

function createHeadingNumberer() {
  const counters = Array<number>(7).fill(0);

  return (depth: number) => {
    if (depth <= 1) {
      counters.fill(0);
      return '';
    }

    // If a document jumps from h2 directly to h4, fill the skipped level so
    // the result remains readable (for example 1.1.1 instead of 1.0.1).
    for (let level = 2; level < depth; level += 1) {
      if (counters[level] === 0) counters[level] = 1;
    }

    counters[depth] += 1;
    for (let level = depth + 1; level < counters.length; level += 1) {
      counters[level] = 0;
    }

    const path = counters.slice(2, depth + 1).join('.');
    return depth === 2 ? `${path}.` : path;
  };
}

function remarkNumberHeadings(options: RenderMarkdownOptions = {}) {
  return (tree: unknown) => {
    if (!options.numberHeadings) return;

    const nextNumber = createHeadingNumberer();
    visitHeadings(tree as MarkdownAstNode, (heading) => {
      const number = nextNumber(heading.depth);
      if (!number) return;

      heading.children = [
        { type: 'text', value: `${number} ` },
        ...(heading.children || []),
      ];
    });
  };
}

function isDoubleDollarMath(node: MarkdownAstNode, source: string) {
  if (node.type !== 'inlineMath') return false;

  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;
  if (typeof start !== 'number' || typeof end !== 'number') return false;

  return source.slice(start, start + 2) === '$$'
    && source.slice(end - 2, end) === '$$';
}

function createDisplayMathNode(node: MarkdownAstNode): MarkdownAstNode {
  const value = node.value || '';

  return {
    ...node,
    type: 'math',
    data: {
      hName: 'pre',
      hChildren: [
        {
          type: 'element',
          tagName: 'code',
          properties: {
            className: ['language-math', 'math-display'],
          },
          children: [{ type: 'text', value }],
        },
      ],
    },
  };
}

/**
 * remark-math only treats $$...$$ as display math when the delimiters occupy
 * their own lines. Obsidian also accepts the compact `text $$...$$ text`
 * form, so promote double-dollar inline nodes into flow math nodes here.
 * Single-dollar math remains inline.
 */
function remarkPromoteDoubleDollarMath(options: { source: string }) {
  return (tree: unknown) => {
    const source = options.source;

    const transform = (parent: MarkdownAstNode) => {
      if (!parent.children?.length) return;

      const nextChildren: MarkdownAstNode[] = [];

      parent.children.forEach((child) => {
        if (child.type !== 'paragraph' || !child.children?.length) {
          transform(child);
          nextChildren.push(child);
          return;
        }

        const containsDisplayMath = child.children.some((inlineNode) => (
          isDoubleDollarMath(inlineNode, source)
        ));

        if (!containsDisplayMath) {
          nextChildren.push(child);
          return;
        }

        let paragraphChildren: MarkdownAstNode[] = [];
        const flushParagraph = () => {
          if (!paragraphChildren.length) return;
          nextChildren.push({
            ...child,
            children: paragraphChildren,
          });
          paragraphChildren = [];
        };

        child.children.forEach((inlineNode) => {
          if (isDoubleDollarMath(inlineNode, source)) {
            flushParagraph();
            nextChildren.push(createDisplayMathNode(inlineNode));
          } else {
            paragraphChildren.push(inlineNode);
          }
        });

        flushParagraph();
      });

      parent.children = nextChildren;
    };

    transform(tree as MarkdownAstNode);
  };
}

export function extractMarkdownToc(
  content: string,
  options: RenderMarkdownOptions & { maxDepth?: number } = {},
): MarkdownTocItem[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(content) as unknown as MarkdownAstNode;
  const nextNumber = createHeadingNumberer();
  const maxDepth = options.maxDepth ?? 3;
  const toc: MarkdownTocItem[] = [];

  visitHeadings(tree, (heading) => {
    const number = options.numberHeadings ? nextNumber(heading.depth) : '';
    if (heading.depth > maxDepth) return;

    const rawText = getHeadingText(heading).trim();
    const headingHtml = getHeadingHtml(heading).trim();
    toc.push({
      level: heading.depth,
      text: number ? `${number} ${rawText}` : rawText,
      html: number ? `${escapeHtml(number)} ${headingHtml}` : headingHtml,
      id: `toc-heading-${toc.length + 1}`,
    });
  });

  return toc;
}

export async function renderMarkdown(
  content: string,
  options: RenderMarkdownOptions = {},
) {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkObsidianImageEmbeds)
    .use(remarkPromoteDoubleDollarMath, { source: content })
    .use(remarkNumberHeadings, options)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, markdownSchema)
    // These two plugins only generate HTML from already-sanitized syntax nodes.
    .use(rehypeHighlight, {
      detect: true,
      ignoreMissing: true,
      subset: ['cpp', 'c', 'python', 'java', 'javascript', 'typescript', 'go', 'rust', 'bash', 'json', 'html', 'css', 'sql', 'xml'],
    })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content);

  return processedContent.toString();
}
