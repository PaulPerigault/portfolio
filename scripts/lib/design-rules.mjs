// Règles de la charte de design v2 (docs/design-charter.md, ADR-0012) : ce qui rend un site « générique ».
// Chaque règle : un nom, un motif, une explication ; `only` limite les extensions concernées ;
// `multiline` applique le motif au fichier entier (balise sur plusieurs lignes), sinon ligne par ligne.

import { GENERIC_PHRASES } from './generic-phrases.mjs';

const CODE = ['.astro', '.ts', '.css'];
const TEXT = ['.astro', '.ts', '.json'];

const PALETTE_COLORS =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

/** Balises et composants de titre ou de libellé : le mono n'y est pas une donnée mais une décoration. */
const LABEL_TAGS = 'h[1-6]|label|legend|summary|th|dt|figcaption|button|Heading|Button|ButtonLink';

export const RULES = [
  {
    name: 'gradient',
    message: 'Pas de dégradé décoratif.',
    pattern: /\b(?:bg-gradient|bg-linear|bg-radial|bg-conic)\b|(?:linear|radial|conic)-gradient\(/,
    only: CODE,
  },
  {
    name: 'ombre',
    message: 'Pas d’ombre décorative : les filets fins structurent la page.',
    pattern: /\b(?:drop-)?shadow(?:-[a-z0-9]+)?\b(?=[\s"'`])|box-shadow|text-shadow/,
    only: CODE,
  },
  {
    name: 'flou',
    message: 'Pas de glassmorphism (backdrop-blur / backdrop-filter).',
    pattern: /backdrop-(?:blur|filter)|\bblur-[a-z0-9]+/,
    only: CODE,
  },
  {
    name: 'couleur-en-dur',
    message: 'Couleur littérale : utiliser un jeton de @paulperigault/tokens.',
    pattern: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/,
    only: CODE,
    allow: [/src\/lib\/theme\.ts$/, /\.test\.ts$/],
  },
  {
    name: 'palette-tailwind',
    message: 'Couleur de palette Tailwind : un seul accent, via les jetons.',
    pattern: new RegExp(
      `\\b(?:bg|text|border|ring|fill|stroke|from|via|to)-(?:${PALETTE_COLORS})-\\d{2,3}\\b`,
    ),
    only: CODE,
  },
  {
    name: 'valeur-arbitraire',
    message: 'Valeur arbitraire (px, couleur) dans une classe : utiliser un jeton.',
    pattern: /[a-z]-\[[^\]\s]*(?:\d+px|#[0-9a-fA-F]{3,8}|rgb)[^\]\s]*\]/,
    only: CODE,
  },
  {
    name: 'famille-typographique',
    message:
      'Pas de serif, ni de mono sur un titre ou un libellé : le mono du design system est réservé au code, aux identifiants, aux empreintes et aux métadonnées.',
    pattern: new RegExp(
      String.raw`\bfont-serif\b|font-family\s*:[^;]*(?<!sans-)\bserif\b|<(?:${LABEL_TAGS})\b[^>]*\bfont-mono\b`,
    ),
    only: CODE,
    multiline: true,
  },
  {
    name: 'rayon',
    message:
      'Rayon autre que ceux du design system : rounded-control (0,25 rem) ou rounded-surface (0,5 rem).',
    pattern: new RegExp(
      String.raw`(?<![\w-])rounded(?!-(?:(?:[trblse]|tl|tr|bl|br|ss|se|es|ee)-)?(?:control|surface)(?![\w-]))(?:-[\w[\]./%-]+)?(?![\w-])|border-radius\s*:(?!\s*var\(--pp-radius-(?:control|surface)\))`,
    ),
    only: CODE,
  },
  {
    name: 'etiquette-majuscules',
    message:
      'Pas d’étiquette en capitales (uppercase), avec ou sans espacement des lettres : un titre est un titre.',
    pattern: /(?<![\w-])uppercase(?![\w-])|text-transform\s*:\s*uppercase/,
    only: CODE,
  },
  {
    name: 'emoji',
    message: 'Pas d’emoji : icônes SVG décoratives (lib/icons.ts).',
    pattern: /\p{Emoji_Presentation}/u,
    only: TEXT,
  },
  {
    name: 'phrase-generique',
    message: 'Formule générique : écrire un fait précis.',
    pattern: new RegExp(
      GENERIC_PHRASES.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
      'i',
    ),
    only: TEXT,
    allow: [/design-rules\.mjs$/, /generic-phrases\.mjs$/, /\.test\./],
  },
];
