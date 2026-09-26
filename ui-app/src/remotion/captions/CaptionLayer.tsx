import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionSegment, CaptionStyleToken, CaptionTrackConfig } from '../../types/captions';
import { getCaptionVariant } from './styleTokens';
 
interface CaptionLayerProps {
  segments: CaptionSegment[];
  config: CaptionTrackConfig;
}
 
const findActiveSegment = (segments: CaptionSegment[], t: number) =>
  segments.find((s) => t >= s.start && t <= s.end);
 
const positionStyle = (position: CaptionTrackConfig['position']): React.CSSProperties => {
  switch (position) {
    case 'top':
      return { justifyContent: 'flex-start', paddingTop: '8%' };
    case 'center':
      return { justifyContent: 'center' };
    default:
      return { justifyContent: 'flex-end', paddingBottom: '15%' };
  }
};
 
export const CaptionLayer: React.FC<CaptionLayerProps> = ({ segments, config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const token = getCaptionVariant(config.styleId) as any;
 
  if (token.animationType === 'none') return null;
 
  const segment = findActiveSegment(segments, t);
  if (!segment) return null;
 
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        ...positionStyle(config.position),
      }}
    >
      <div style={{ maxWidth: `${config.maxWidthPercent ?? 80}%`, textAlign: 'center' }}>
        {renderVariant(token, segment, t, fps)}
      </div>
    </AbsoluteFill>
  );
};
 
const baseTextStyle = (token: CaptionStyleToken): React.CSSProperties => ({
  fontFamily: token.fontFamily,
  fontWeight: token.fontWeight,
  color: token.textColor,
  fontStyle: token.italic ? 'italic' : 'normal',
  textTransform: token.uppercase ? 'uppercase' : 'none',
  letterSpacing: token.letterSpacing,
});
 
function renderVariant(token: CaptionStyleToken, segment: CaptionSegment, t: number, fps: number) {
  switch (token.animationType) {
    case 'hormoziPop':
      return <HormoziPop token={token} segment={segment} t={t} fps={fps} />;
    case 'karaokeSweep':
      return <KaraokeSweep token={token} segment={segment} t={t} fps={fps} />;
    case 'bouncingBox':
      return <BouncingBox token={token} segment={segment} t={t} fps={fps} />;
    case 'slidingBox':
      return <SlidingBox token={token} segment={segment} t={t} fps={fps} />;
    case 'typewriterFade':
      return <TypewriterFade token={token} segment={segment} t={t} fps={fps} />;
    case 'wordHighlight':
      return <WordHighlight token={token} segment={segment} t={t} fps={fps} />;
    case 'cinematicFade':
      return <CinematicFade token={token} segment={segment} t={t} fps={fps} />;
    default:
      return null;
  }
}
 
/** Hormozi / Bellatrix Pop */
const HormoziPop: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  // Find the exact word currently spoken
  const active = segment.words.find((w) => t >= w.start && t <= w.end) ?? segment.words[segment.words.length - 1];
  const elapsed = (t - active.start) * fps;
  const progress = spring({ frame: Math.max(elapsed, 0), fps, config: { damping: 10, mass: 0.5, stiffness: 200 } });
  
  return (
    <span
      style={{
        ...baseTextStyle(token),
        fontSize: 72,
        display: 'inline-block',
        textShadow: `4px 4px 0 #7e22ce, -2px -2px 0 #7e22ce, 2px -2px 0 #7e22ce, -2px 2px 0 #7e22ce, 8px 8px 0 #7e22ce`,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])}) rotate(-5deg)`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      {active.text}
    </span>
  );
};
 
/** Karaoke Sweep (Alvcone Blue) */
const KaraokeSweep: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em', justifyContent: 'center' }}>
      {segment.words.map((w, i) => {
        const isActive = t >= w.start && t <= w.end;
        const isPast = t > w.end;
        const activeOrPast = isActive || isPast;
        
        const elapsed = (t - w.start) * fps;
        const progress = spring({ frame: Math.max(elapsed, 0), fps, config: { damping: 12, mass: 0.5, stiffness: 150 } });

        return (
          <span
            key={i}
            style={{
              ...baseTextStyle(token),
              fontSize: 64,
              display: 'inline-block',
              color: activeOrPast ? token.textColor : 'rgba(255, 255, 255, 0.3)',
              textShadow: activeOrPast ? `2px 2px 0 #3b82f6, -2px -2px 0 #3b82f6, 2px -2px 0 #3b82f6, -2px 2px 0 #3b82f6, 5px 5px 0 #3b82f6` : 'none',
              transform: isActive ? `scale(${interpolate(progress, [0, 1], [0.9, 1])}) rotate(-2deg)` : 'scale(0.9) rotate(-2deg)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
 
/** Bouncing Box (Pacific) */
const BouncingBox: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  const active = segment.words.find((w) => t >= w.start && t <= w.end) ?? segment.words[segment.words.length - 1];
  const elapsed = (t - active.start) * fps;
  const progress = spring({ frame: Math.max(elapsed, 0), fps, config: { damping: 12, mass: 0.6 } });
  
  return (
    <span
      style={{
        ...baseTextStyle(token),
        fontSize: 54,
        display: 'inline-block',
        background: token.background,
        padding: '0.2em 0.6em',
        borderRadius: 12,
        transform: `translateY(${interpolate(progress, [0, 1], [-20, 0])}px)`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      {active.text}
    </span>
  );
};
 
/** Sliding Box (Cartwheel Blue) */
const SlidingBox: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  const active = segment.words.find((w) => t >= w.start && t <= w.end) ?? segment.words[segment.words.length - 1];
  const elapsed = (t - active.start) * fps;
  const progress = spring({ frame: Math.max(elapsed, 0), fps, config: { damping: 14 } });
  
  return (
    <span
      style={{
        ...baseTextStyle(token),
        fontSize: 54,
        display: 'inline-block',
        background: token.background,
        padding: '0.2em 0.6em',
        borderRadius: 12,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      {active.text}
    </span>
  );
};
 
/** Typewriter Fade (Nova) */
const TypewriterFade: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em', justifyContent: 'center' }}>
      {segment.words.map((w, i) => {
        const visible = t >= w.start;
        return (
          <span
            key={i}
            style={{
              ...baseTextStyle(token),
              fontSize: 36,
              opacity: visible ? 1 : 0,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
 
/** Word Highlight (Vitamin B) */
const WordHighlight: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em', justifyContent: 'center' }}>
      {segment.words.map((w, i) => {
        const isActive = t >= w.start && t <= w.end;
        return (
          <span
            key={i}
            style={{
              ...baseTextStyle(token),
              fontSize: 48,
              background: isActive ? token.background : 'transparent',
              padding: '0 0.2em',
              borderRadius: 6,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
 
/** Cinematic Fade (Quintessence) */
const CinematicFade: React.FC<{ token: CaptionStyleToken; segment: CaptionSegment; t: number; fps: number }> = ({
  token,
  segment,
  t,
  fps,
}) => {
  const elapsed = (t - segment.start) * fps;
  const progress = spring({ frame: elapsed, fps, config: { damping: 20 } });
  
  return (
    <span
      style={{
        ...baseTextStyle(token),
        fontSize: 48,
        display: 'inline-block',
        textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      {segment.words.map(w => w.text).join(' ')}
    </span>
  );
};
