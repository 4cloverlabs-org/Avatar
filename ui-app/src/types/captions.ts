export interface WordTiming {
  /** The word as spoken, including trailing punctuation. */
  text: string;
  /** Start time in seconds, relative to the start of the video. */
  start: number;
  /** End time in seconds, relative to the start of the video. */
  end: number;
}
 
export interface CaptionSegment {
  id: string;
  /** Start time of the segment (first word's start), in seconds. */
  start: number;
  /** End time of the segment (last word's end), in seconds. */
  end: number;
  words: WordTiming[];
}
 
export type CaptionAnimationType =
  | 'none'
  | 'hormoziPop'
  | 'karaokeSweep'
  | 'bouncingBox'
  | 'slidingBox'
  | 'typewriterFade'
  | 'wordHighlight'
  | 'cinematicFade';
 
export interface CaptionStyleToken {
  id: string;
  name: string;
  animationType: CaptionAnimationType;
  fontFamily: string;
  fontWeight: number;
  textColor: string;
  /** Solid or gradient CSS background for the caption box/chip, if the style uses one. */
  background?: string;
  /** Stroke color for outline-style text. */
  strokeColor?: string;
  accentColor: string;
  uppercase?: boolean;
  italic?: boolean;
  letterSpacing?: string;
}
 
export interface CaptionTrackConfig {
  styleId: string;
  position: 'top' | 'center' | 'bottom';
  maxWidthPercent?: number;
}