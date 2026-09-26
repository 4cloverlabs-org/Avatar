export type HighlightMode = 'box' | 'color' | 'none';

export interface CaptionVariant {
  id: string;
  name: string;
  highlightMode: HighlightMode;
  highlightColor: string;
  activeTextColor: string;
  textColor: string;
  strokeColor: string;
}

export const CAPTION_VARIANTS: CaptionVariant[] = [
  {
    id: 'none',
    name: 'None',
    highlightMode: 'none',
    highlightColor: 'transparent',
    activeTextColor: '#ffffff',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'energy',
    name: 'Energy',
    highlightMode: 'box',
    highlightColor: '#39FF6A',
    activeTextColor: '#0a0a0a',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'vitamin-b',
    name: 'Vitamin B',
    highlightMode: 'box',
    highlightColor: '#FFE619',
    activeTextColor: '#0a0a0a',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'arion-pink',
    name: 'Arion Pink',
    highlightMode: 'box',
    highlightColor: '#FF4FA3',
    activeTextColor: '#ffffff',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'pacific',
    name: 'Pacific',
    highlightMode: 'box',
    highlightColor: '#3FA9FF',
    activeTextColor: '#0a0a0a',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'cartwheel-black',
    name: 'Cartwheel Black',
    highlightMode: 'box',
    highlightColor: '#ffffff',
    activeTextColor: '#0a0a0a',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'nova',
    name: 'Nova',
    highlightMode: 'color',
    highlightColor: 'transparent',
    activeTextColor: '#39FF6A',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
  {
    id: 'sirius',
    name: 'Sirius',
    highlightMode: 'color',
    highlightColor: 'transparent',
    activeTextColor: '#FFE619',
    textColor: '#ffffff',
    strokeColor: '#000000',
  },
];

export const getCaptionVariant = (id: string): CaptionVariant =>
  CAPTION_VARIANTS.find((v) => v.id === id) ?? CAPTION_VARIANTS[1];

