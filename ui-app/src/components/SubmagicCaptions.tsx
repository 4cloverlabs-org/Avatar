import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface SubmagicCaptionsProps {
  words: WordTiming[];
  highlightMode?: 'box' | 'color' | 'none';
  highlightColor?: string;
  activeTextColor?: string;
  textColor?: string;
  strokeColor?: string;
  wordsPerPage?: number;
  charsPerLine?: number;
  wordSpacing?: string;
  position?: 'bottom' | 'center' | 'top';
  fontSize?: number;
}

interface Page {
  words: WordTiming[];
  start: number;
  end: number;
}

function groupIntoPages(words: WordTiming[], wordsPerPage: number, charsPerLine?: number, pauseBreakSeconds = 0.6): Page[] {
  const pages: Page[] = [];
  let current: WordTiming[] = [];
  let currentChars = 0;

  const flush = () => {
    if (current.length === 0) return;
    pages.push({ words: current, start: current[0].start, end: current[current.length - 1].end });
    current = [];
    currentChars = 0;
  };

  words.forEach((w, i) => {
    const prev = current[current.length - 1];
    const bigPause = prev ? w.start - prev.end > pauseBreakSeconds : false;
    
    // Check constraints
    if (bigPause) flush();
    else if (charsPerLine && currentChars + w.text.length > charsPerLine && current.length > 0) flush();
    else if (!charsPerLine && current.length >= wordsPerPage) flush();
    
    current.push(w);
    currentChars += w.text.length + 1;
    if (i === words.length - 1) flush();
  });

  return pages;
}

const positionStyle = (position: SubmagicCaptionsProps['position']): React.CSSProperties => {
  switch (position) {
    case 'top':
      return { justifyContent: 'flex-start', paddingTop: '9%' };
    case 'center':
      return { justifyContent: 'center' };
    default:
      return { justifyContent: 'flex-end', paddingBottom: '13%' };
  }
};

export const SubmagicCaptions: React.FC<SubmagicCaptionsProps> = ({
  words,
  highlightMode = 'box',
  highlightColor = '#39FF6A',
  activeTextColor = '#0a0a0a',
  textColor = '#ffffff',
  strokeColor = '#000000',
  wordsPerPage = 3,
  charsPerLine,
  wordSpacing = 'normal',
  position = 'bottom',
  fontSize = 68,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  if (highlightMode === 'none') return null;

  const pages = useMemo(() => groupIntoPages(words, wordsPerPage, charsPerLine), [words, wordsPerPage, charsPerLine]);
  const page = pages.find((p) => t >= p.start && t <= p.end);
  if (!page) return null;

  const activeIndex = page.words.findIndex((w) => t >= w.start && t <= w.end);

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', ...positionStyle(position) }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: wordSpacing === 'normal' ? '0.3em' : wordSpacing,
          maxWidth: '82%',
          fontFamily: '"Arial Black", Inter, sans-serif',
          fontWeight: 900,
          fontSize,
          textTransform: 'uppercase',
        }}
      >
        {page.words.map((w, i) => {
          const isActive = i === activeIndex;
          const elapsed = (t - w.start) * fps;
          const progress = spring({
            frame: Math.max(elapsed, 0),
            fps,
            config: { damping: 11, stiffness: 260, mass: 0.7 },
          });
          const scale = isActive ? interpolate(progress, [0, 1], [0.55, 1], { extrapolateRight: 'clamp' }) : 1;

          // Compute styles based on mode
          const isBox = highlightMode === 'box';
          const bg = isActive && isBox ? highlightColor : 'transparent';
          const fg = isActive ? activeTextColor : textColor;
          const padding = isActive && isBox ? '0.08em 0.22em' : '0.08em 0';
          // Outline active word if it's 'color' mode to preserve readability, otherwise no outline for active 'box' mode
          const outline = (!isActive || !isBox) && strokeColor ? `8px ${strokeColor}` : 'none';

          return (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                padding,
                borderRadius: 10,
                background: bg,
                color: fg,
                WebkitTextStroke: outline,
                paintOrder: 'stroke fill',
                textShadow: '0 3px 8px rgba(0,0,0,0.5)',
                transform: `scale(${scale})`,
                transformOrigin: 'center bottom',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
