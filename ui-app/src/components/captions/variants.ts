export type CaptionMode =
  | 'colorEmphasis' // Pulse — keyword changes color, rest plain
  | 'sizeEmphasis' // Nova — keyword just gets bigger, no color change
  | 'mixedItalic' // Cove — plain sans for most words, italic serif for emphasized ones
  | 'pillPhrase' // Energy / Freshly / Thuban / Mars / Zodiac / Andromeda / Cartwheel Blue — the whole phrase sits in one box
  | 'splitEmphasis' // M81 / Bellatrix / Copernicus / Aldebaran / etc — per-word rules (box / color / plain)
  | 'stackedBubbles' // Arion Pink — each line is its own pill bubble, stacked
  | 'soloItalic' // Quintessence — one word at a time, centered, italic serif, no background
  | 'altWeightItalic' // Prism — alternating regular / bold-italic words, same color
  | 'stickerWord' // Runway — a single keyword on its own rotated sticker box
  | 'impactOutline' // Grace / Leo — one huge word, colored fill with a thick black outline
  | 'flatColorPhrase' // Irena / Travel / Poster / Vitamin A — whole phrase, one flat color, no per-word split
  | 'fadeEmphasis' // Cassiopeia — first word solid, following words fade out
  | 'altColor' // Omega Green — color alternates every other word
  | 'soloGlow'; // Mizar — one word at a time, centered, soft glow

/** Per-word override used by 'splitEmphasis'. Any word index not listed falls back to the variant's base color, no box. */
export interface WordRule {
  index: number;
  style: 'box' | 'color';
  bg?: string;
  color?: string;
}

export interface CaptionVariant {
  id: string;
  name: string;
  mode: CaptionMode;
  fontFamily: string;
  italicFontFamily?: string;
  baseColor: string;
  emphasisColor?: string;
  pillColor?: string;
  /** Phrase-level box styling, used by 'pillPhrase'. */
  phraseTranslucent?: boolean;
  phraseRotate?: number;
  phraseTextScale?: number; // relative to base font size, e.g. 0.6 for a smaller sentence pill
  /** Per-word color overrides INSIDE a pillPhrase box (index -> color), e.g. Cartwheel Blue. */
  phraseWordColors?: Record<number, string>;
  /** Per-word rules, used by 'splitEmphasis'. */
  wordRules?: WordRule[];
  /** Outline color. Used by 'impactOutline', and optionally by 'colorEmphasis' / 'splitEmphasis' / 'flatColorPhrase' for the thick-black-outline look. */
  strokeColor?: string;
  /** Color for words after the first, used by 'fadeEmphasis'. */
  fadeColor?: string;
  /** Second color in the alternating pattern, used by 'altColor'. */
  altColorSecondary?: string;
  /** Which word index gets the emphasis treatment by default for this variant (colorEmphasis / sizeEmphasis / fadeEmphasis / stickerWord). Overridable per-call via the `keywordIndex` prop. Default 0. */
  defaultKeywordIndex?: number;
  /** Renders the emphasized word in italics (Courage). */
  italic?: boolean;
  /** Overrides the default bold weight — used for quiet/plain presets like Million. */
  fontWeightOverride?: number;
  /** Skips the automatic uppercase transform — used for lowercase presets like Million. */
  noUppercase?: boolean;
}

export const CAPTION_VARIANTS: CaptionVariant[] = [
  {
    id: 'none',
    name: 'None',
    mode: 'colorEmphasis',
    fontFamily: 'Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#ffffff',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#38BDF8',
  },
  {
    id: 'nova',
    name: 'Nova',
    mode: 'sizeEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
  },
  {
    id: 'cove',
    name: 'Cove',
    mode: 'mixedItalic',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    italicFontFamily: '"Playfair Display", Georgia, serif',
    baseColor: '#ffffff',
  },
  {
    id: 'energy',
    name: 'Energy',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#0a0a0a',
    pillColor: '#ececec',
  },
  {
    id: 'm81',
    name: 'M81',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 1, style: 'box', bg: '#6C3FD1', color: '#7CFF3D' }],
  },
  {
    id: 'bellatrix',
    name: 'Bellatrix',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 1, style: 'box', bg: '#6C3FD1', color: '#7CFF3D' }],
  },
  {
    id: 'arion-pink',
    name: 'Arion Pink',
    mode: 'stackedBubbles',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: '#E8447A',
  },
  {
    id: 'quintessence',
    name: 'Quintessence',
    mode: 'soloItalic',
    fontFamily: '"Playfair Display", Georgia, serif',
    baseColor: '#F5C242',
  },
  {
    id: 'prism',
    name: 'Prism',
    mode: 'altWeightItalic',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
  },
  {
    id: 'freshly',
    name: 'Freshly',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#e8e8ea',
    pillColor: 'rgba(40,40,44,0.55)',
    phraseTranslucent: true,
  },
  {
    id: 'thuban',
    name: 'Thuban',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#0a0a0a',
    pillColor: '#F5E619',
    phraseRotate: -3,
  },
  {
    id: 'mars',
    name: 'Mars',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(10,10,10,0.6)',
    phraseTranslucent: true,
    phraseTextScale: 0.55,
  },
  {
    id: 'runway',
    name: 'Runway',
    mode: 'stickerWord',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#000000',
    emphasisColor: '#E8347A',
  },
  {
    id: 'grace',
    name: 'Grace',
    mode: 'impactOutline',
    fontFamily: '"Arial Black", Arial, sans-serif',
    baseColor: '#7CFF3D',
    strokeColor: '#000000',
  },
  {
    id: 'copernicus',
    name: 'Copernicus',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [
      { index: 0, style: 'box', bg: '#B8A8E8', color: '#1a1a1a' },
      { index: 1, style: 'color', color: '#7CFF3D' },
    ],
  },
  {
    id: 'aldebaran',
    name: 'Aldebaran',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 1, style: 'box', bg: '#6C3FD1', color: '#DCE8FF' }],
  },
  // ---- Batch 3 ----
  {
    id: 'alycone-blue',
    name: 'Alycone Blue',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 1, style: 'box', bg: '#5FD8D8', color: '#0a2a2a' }],
  },
  {
    id: 'travel',
    name: 'Travel',
    mode: 'flatColorPhrase',
    fontFamily: '"Arial Black", Arial, sans-serif',
    baseColor: '#E8F53D',
    strokeColor: '#000000',
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: '#0a0a0a',
    phraseTextScale: 0.85,
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    mode: 'fadeEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    fadeColor: 'rgba(255,255,255,0.45)',
  },
  {
    id: 'citadelle',
    name: 'Citadelle',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 1, style: 'box', bg: '#8A5FE0', color: '#ffffff' }],
  },
  {
    id: 'haedus',
    name: 'Haedus',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#7CFF3D',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'pacific',
    name: 'Pacific',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
    wordRules: [{ index: 1, style: 'box', bg: '#4C3AA8', color: '#ffffff' }],
  },
  {
    id: 'leo',
    name: 'Leo',
    mode: 'impactOutline',
    fontFamily: '"Arial Black", Arial, sans-serif',
    baseColor: '#F5D33D',
    strokeColor: '#000000',
  },
  {
    id: 'vitamin-b',
    name: 'Vitamin B',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
    wordRules: [{ index: 2, style: 'box', bg: '#7FD8C8', color: '#0a2a2a' }],
  },
  {
    id: 'dimidium',
    name: 'Dimidium',
    mode: 'sizeEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#F5D33D',
  },
  {
    id: 'irena',
    name: 'Irena',
    mode: 'flatColorPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#3DE85A',
  },
  {
    id: 'cygnus-a',
    name: 'Cygnus A',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
    wordRules: [{ index: 1, style: 'box', bg: '#6C3FD1', color: '#ffffff' }],
  },
  {
    id: 'ingrid',
    name: 'Ingrid',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#E8433D',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'zodiac',
    name: 'Zodiac',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(20,20,22,0.65)',
    phraseTranslucent: true,
    phraseTextScale: 0.62,
  },
  {
    id: 'sirius',
    name: 'Sirius',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
    wordRules: [{ index: 1, style: 'box', bg: '#6C3FD1', color: '#3DE85A' }],
  },
  {
    id: 'chase',
    name: 'Chase',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(30,32,30,0.6)',
    phraseTranslucent: true,
    phraseTextScale: 0.6,
    phraseWordColors: { 3: 'rgba(255,255,255,0.6)', 4: 'rgba(255,255,255,0.6)', 5: 'rgba(255,255,255,0.6)' },
  },
  {
    id: 'cartwheel-black',
    name: 'Cartwheel Black',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#8A5FE0',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'claudette',
    name: 'Claudette',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'cartwheel-blue',
    name: 'Cartwheel Blue',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(95,216,200,0.35)',
    phraseTranslucent: true,
    phraseWordColors: { 1: '#3DE85A' },
  },
  {
    id: 'pollux-b',
    name: 'Pollux B',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#8A5FE0',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'poster',
    name: 'Poster',
    mode: 'flatColorPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'omega-green',
    name: 'Omega Green',
    mode: 'altColor',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#3DE85A',
    altColorSecondary: '#c9c9c9',
    strokeColor: '#000000',
  },
  {
    id: 'performance',
    name: 'Performance',
    mode: 'sizeEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#F5D33D',
  },
  {
    id: 'vitamin-a',
    name: 'Vitamin A',
    mode: 'flatColorPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
  },
  // ---- Batch 4 ----
  {
    id: 'million',
    name: 'Million',
    mode: 'flatColorPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#e6e6e8',
    fontWeightOverride: 400,
    noUppercase: true,
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#F5D33D',
    defaultKeywordIndex: 1,
  },
  {
    id: 'capella',
    name: 'Capella',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
    wordRules: [
      { index: 0, style: 'box', bg: '#6C3FD1', color: '#ffffff' },
      { index: 1, style: 'color', color: '#E8433D' },
    ],
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 2, style: 'box', bg: '#E86FA0', color: '#ffffff' }],
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#0a0a0a',
    pillColor: '#ffffff',
    phraseTextScale: 0.82,
  },
  {
    id: 'lumin',
    name: 'Lumin',
    mode: 'sizeEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    defaultKeywordIndex: 0,
  },
  {
    id: 'polaris',
    name: 'Polaris',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(10,10,10,0.65)',
    phraseTranslucent: true,
    phraseTextScale: 0.55,
  },
  {
    id: 'omega-red',
    name: 'Omega Red',
    mode: 'flatColorPhrase',
    fontFamily: '"Arial Black", Arial, sans-serif',
    baseColor: '#E8433D',
    strokeColor: '#000000',
  },
  {
    id: 'messages',
    name: 'Messages',
    mode: 'stackedBubbles',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: '#4C8BF5',
  },
  {
    id: 'lynx',
    name: 'Lynx',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    wordRules: [{ index: 1, style: 'box', bg: '#6C3FD1', color: '#3DE85A' }],
  },
  {
    id: 'courage',
    name: 'Courage',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#E8433D',
    strokeColor: '#000000',
    italic: true,
    defaultKeywordIndex: 0,
  },
  {
    id: 'acamar',
    name: 'Acamar',
    mode: 'stickerWord',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    pillColor: '#6C3FD1',
  },
  {
    id: 'owl',
    name: 'Owl',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'broderick',
    name: 'Broderick',
    mode: 'splitEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    strokeColor: '#000000',
    wordRules: [
      { index: 0, style: 'box', bg: '#6C3FD1', color: '#ffffff' },
      { index: 1, style: 'color', color: '#F5D33D' },
    ],
  },
  {
    id: 'triangulum',
    name: 'Triangulum',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(30,30,32,0.55)',
    phraseTranslucent: true,
    phraseTextScale: 0.6,
  },
  {
    id: 'bette',
    name: 'Bette',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'kang',
    name: 'Kang',
    mode: 'altColor',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#C8F53D',
    altColorSecondary: '#3DE85A',
    strokeColor: '#000000',
  },
  {
    id: 'orbitar-black',
    name: 'Orbitar Black',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: '#0a0a0a',
    phraseTextScale: 0.68,
    phraseWordColors: { 0: '#F5D33D' },
  },
  {
    id: 'cartwheel-purple',
    name: 'Cartwheel Purple',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(108,63,209,0.4)',
    phraseTranslucent: true,
    phraseWordColors: { 1: '#3DE85A' },
  },
  {
    id: 'alcyone',
    name: 'Alcyone',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(138,95,224,0.4)',
    phraseTranslucent: true,
    phraseWordColors: { 1: '#3DE85A' },
  },
  {
    id: 'theta',
    name: 'Theta',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'acrab',
    name: 'Acrab',
    mode: 'stickerWord',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    pillColor: '#6C3FD1',
  },
  {
    id: 'mizar',
    name: 'Mizar',
    mode: 'soloGlow',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#f5f0ff',
    emphasisColor: '#B8A8E8',
  },
  {
    id: 'alhena',
    name: 'Alhena',
    mode: 'impactOutline',
    fontFamily: '"Arial Black", Arial, sans-serif',
    baseColor: '#8A5FE0',
    strokeColor: '#000000',
  },
  {
    id: 'castor',
    name: 'Castor',
    mode: 'pillPhrase',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    pillColor: 'rgba(108,63,209,0.45)',
    phraseTranslucent: true,
    phraseWordColors: { 1: '#3FA9FF' },
  },
  {
    id: 'medusa',
    name: 'Medusa',
    mode: 'colorEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    emphasisColor: '#3DE85A',
    strokeColor: '#000000',
    defaultKeywordIndex: 1,
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    mode: 'sizeEmphasis',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#ffffff',
    defaultKeywordIndex: 0,
  },
  {
    id: 'recipe',
    name: 'Recipe',
    mode: 'altColor',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    baseColor: '#E8433D',
    altColorSecondary: '#ffffff',
  },
];

export const getCaptionVariant = (id: string): CaptionVariant =>
  CAPTION_VARIANTS.find((v) => v.id === id) ?? CAPTION_VARIANTS[1];
