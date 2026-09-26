import React from 'react';
import { SubmagicCaptions } from '../SubmagicCaptions';
import { getCaptionVariant } from '../../remotion/captions/styleTokens';
import { CaptionsData } from './engine/types';

export interface CaptionRendererProps {
  data: CaptionsData;
  style: {
    theme: string;
    fontSize: number;
    position: 'top' | 'center' | 'bottom';
    charsPerLine?: number;
    wordSpacing?: string;
  };
}

export const CaptionRenderer: React.FC<CaptionRendererProps> = ({ data, style }) => {
  const variant = getCaptionVariant(style.theme);
  
  if (variant.highlightMode === 'none') return null;

  // Flatten the lines back to words since SubmagicCaptions handles its own layout
  // with our new charsPerLine logic
  const flatWords = data.lines.flatMap(line => line.words);

  return (
    <SubmagicCaptions
      words={flatWords}
      highlightMode={variant.highlightMode}
      highlightColor={variant.highlightColor}
      activeTextColor={variant.activeTextColor}
      textColor={variant.textColor}
      strokeColor={variant.strokeColor}
      charsPerLine={style.charsPerLine}
      wordSpacing={style.wordSpacing}
      position={style.position}
      fontSize={style.fontSize}
    />
  );
};
