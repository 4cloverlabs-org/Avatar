import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionVariant, getCaptionVariant } from './variants';

export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface CaptionsAiCaptionProps {
  /** Flat word-level timestamps for the whole clip. */
  words: WordTiming[];
  variantId: string;
  /** Overrides the variant's own default emphasis position for this call. Usually leave unset. */
  keywordIndex?: number;
  /** Max words grouped into one on-screen cue before a pause forces a break. Default 5. */
  wordsPerCue?: number;
  fontSize?: number;
  position?: 'top' | 'middle' | 'bottom' | 'thumbnail';
}

interface Cue {
  words: WordTiming[];
  start: number;
  end: number;
}

function groupIntoCues(words: WordTiming[], wordsPerCue: number, pauseBreakSeconds = 0.6): Cue[] {
  const cues: Cue[] = [];
  let current: WordTiming[] = [];
  const flush = () => {
    if (current.length === 0) return;
    cues.push({ words: current, start: current[0].start, end: current[current.length - 1].end });
    current = [];
  };
  words.forEach((w, i) => {
    const prev = current[current.length - 1];
    const bigPause = prev ? w.start - prev.end > pauseBreakSeconds : false;
    if (bigPause || current.length >= wordsPerCue) flush();
    current.push(w);
    if (i === words.length - 1) flush();
  });
  return cues;
}

const wordOpacity = (t: number, w: WordTiming, fps: number) =>
  interpolate((t - w.start) * fps, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const CaptionsAiCaption: React.FC<CaptionsAiCaptionProps> = ({
  words,
  variantId,
  keywordIndex,
  wordsPerCue = 5,
  fontSize = 44,
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const variant = getCaptionVariant(variantId);
  // Falls back to the variant's own natural emphasis position (e.g. Haedus
  // emphasizes word 1 "VIEWS?" by default) rather than always word 0.
  const effectiveKeywordIndex = keywordIndex ?? variant.defaultKeywordIndex ?? 0;

  const cues = useMemo(() => groupIntoCues(words, wordsPerCue), [words, wordsPerCue]);
  const cue = cues.find((c, i) => {
    const nextCue = cues[i + 1];
    const isAfterStart = t >= c.start;
    const isBeforeNext = nextCue ? t < nextCue.start : true;
    const isWithinGrace = t <= c.end + 0.5;
    return isAfterStart && isBeforeNext && isWithinGrace;
  });
  
  if (!cue || variantId === 'none') return null;

  const getContainerPos = (): React.CSSProperties => {
    if (position === 'thumbnail' || variant.mode === 'soloItalic' || variant.mode === 'soloGlow') {
      return { justifyContent: 'center', alignItems: 'center' };
    }
    switch (position) {
      case 'top':
        return { justifyContent: 'flex-start', paddingTop: '15%', alignItems: 'center' };
      case 'middle':
        return { justifyContent: 'center', alignItems: 'center' };
      case 'bottom':
      default:
        // Captions.ai style bottom-center or bottom-left depending on style. We'll use center.
        return { justifyContent: 'flex-end', paddingBottom: '12%', alignItems: 'center' };
    }
  };

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...getContainerPos() }}>
      {renderMode(variant, cue, effectiveKeywordIndex, t, fps, fontSize)}
    </AbsoluteFill>
  );
};

function renderMode(
  variant: CaptionVariant,
  cue: Cue,
  keywordIndex: number,
  t: number,
  fps: number,
  fontSize: number
) {
  switch (variant.mode) {
    case 'colorEmphasis':
      return <ColorEmphasis variant={variant} cue={cue} keywordIndex={keywordIndex} t={t} fps={fps} fontSize={fontSize} />;
    case 'sizeEmphasis':
      return <SizeEmphasis variant={variant} cue={cue} keywordIndex={keywordIndex} t={t} fps={fps} fontSize={fontSize} />;
    case 'mixedItalic':
      return <MixedItalic variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'pillPhrase':
      return <PillPhrase variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'splitEmphasis':
      return <SplitEmphasis variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'stackedBubbles':
      return <StackedBubbles variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'soloItalic':
      return <SoloItalic variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'altWeightItalic':
      return <AltWeightItalic variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'stickerWord':
      return <StickerWord variant={variant} cue={cue} keywordIndex={keywordIndex} t={t} fps={fps} fontSize={fontSize} />;
    case 'impactOutline':
      return <ImpactOutline variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'flatColorPhrase':
      return <FlatColorPhrase variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'fadeEmphasis':
      return <FadeEmphasis variant={variant} cue={cue} keywordIndex={keywordIndex} t={t} fps={fps} fontSize={fontSize} />;
    case 'altColor':
      return <AltColor variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    case 'soloGlow':
      return <SoloGlow variant={variant} cue={cue} t={t} fps={fps} fontSize={fontSize} />;
    default:
      return null;
  }
}

/** Pulse / Haedus / Ingrid / Cartwheel Black / Claudette / Pollux B — the keyword switches color, everything else stays plain. `strokeColor`, if set, adds the thick black outline seen on the bolder presets. */
const ColorEmphasis: React.FC<{
  variant: CaptionVariant;
  cue: Cue;
  keywordIndex: number;
  t: number;
  fps: number;
  fontSize: number;
}> = ({ variant, cue, keywordIndex, t, fps, fontSize }) => (
  <div style={{ fontFamily: variant.fontFamily, fontWeight: 800, fontSize, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', gap: '0.1em' }}>
    {cue.words.map((w, i) => (
      <span
        key={i}
        style={{
          color: i === keywordIndex ? variant.emphasisColor : variant.baseColor,
          fontStyle: i === keywordIndex && variant.italic ? 'italic' : 'normal',
          WebkitTextStroke: variant.strokeColor ? `2.5px ${variant.strokeColor}` : undefined,
          paintOrder: variant.strokeColor ? 'stroke fill' : undefined,
          opacity: wordOpacity(t, w, fps),
        }}
      >
        {i === keywordIndex ? w.text.toUpperCase() : w.text}
      </span>
    ))}
  </div>
);

/** Nova / Dimidium / Performance — the keyword is bigger. If `emphasisColor` is set (Dimidium, Performance) it also changes color; otherwise (Nova) only the size changes. */
const SizeEmphasis: React.FC<{
  variant: CaptionVariant;
  cue: Cue;
  keywordIndex: number;
  t: number;
  fps: number;
  fontSize: number;
}> = ({ variant, cue, keywordIndex, t, fps, fontSize }) => (
  <div style={{ fontFamily: variant.fontFamily, fontWeight: 800, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '0.1em' }}>
    {cue.words.map((w, i) => (
      <span
        key={i}
        style={{
          color: i === keywordIndex && variant.emphasisColor ? variant.emphasisColor : variant.baseColor,
          fontSize: i === keywordIndex ? fontSize * 1.35 : fontSize * 0.72,
          opacity: wordOpacity(t, w, fps),
        }}
      >
        {i === keywordIndex ? w.text.toUpperCase() : w.text}
      </span>
    ))}
  </div>
);

/** Cove — plain sans for most words, italic serif for the emphasized one(s), softly transparent. */
const MixedItalic: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => (
  <div style={{ fontSize, lineHeight: 1.3, maxWidth: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', gap: '0.15em' }}>
    {cue.words.map((w, i) => {
      // Roughly matches the reference: shorter/common words plain, longer or later words italic serif.
      const useItalic = w.text.length > 4 || i === cue.words.length - 1;
      return (
        <span
          key={i}
          style={{
            fontFamily: useItalic ? variant.italicFontFamily : variant.fontFamily,
            fontStyle: useItalic ? 'italic' : 'normal',
            fontWeight: useItalic ? 500 : 700,
            color: variant.baseColor,
            opacity: wordOpacity(t, w, fps) * (useItalic ? 0.85 : 1),
          }}
        >
          {w.text}
        </span>
      );
    })}
  </div>
);

/**
 * Energy / Freshly / Thuban / Mars / Andromeda / Zodiac / Chase / Cartwheel
 * Blue — the whole phrase sits inside one box. `phraseTranslucent` gives the
 * soft dark-glass look, `phraseRotate` the sticker tilt (Thuban),
 * `phraseTextScale` shrinks the font for a longer sentence, and
 * `phraseWordColors` recolors individual words INSIDE the box.
 */
const PillPhrase: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => {
  const progress = spring({ frame: Math.max((t - cue.start) * fps, 0), fps, config: { damping: 14 } });
  const rotate = variant.phraseRotate ?? 0;
  return (
    <div
      style={{
        display: 'inline-block',
        maxWidth: '85%',
        background: variant.pillColor,
        fontFamily: variant.fontFamily,
        fontWeight: variant.phraseTranslucent ? 600 : 700,
        fontSize: fontSize * (variant.phraseTextScale ?? 0.8),
        lineHeight: 1.3,
        textAlign: 'center',
        padding: '0.3em 0.6em',
        borderRadius: variant.phraseRotate ? 4 : 10,
        backdropFilter: variant.phraseTranslucent ? 'blur(6px)' : undefined,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [10, 0])}px) rotate(${rotate}deg)`,
      }}
    >
      {cue.words.map((w, i) => (
        <span key={i} style={{ color: variant.phraseWordColors?.[i] ?? variant.baseColor }}>
          {w.text}{' '}
        </span>
      ))}
    </div>
  );
};

/**
 * M81 / Bellatrix / Copernicus / Aldebaran / etc.
 */
const SplitEmphasis: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => (
  <div
    style={{
      fontFamily: variant.fontFamily,
      fontWeight: 800,
      fontSize,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.15em',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {cue.words.map((w, i) => {
      const rule = variant.wordRules?.find((r) => r.index === i);
      const progress = spring({ frame: Math.max((t - w.start) * fps, 0), fps, config: { damping: 12 } });
      const opacity = interpolate(progress, [0, 1], [0, 1]);

      if (!rule) {
        return (
          <span
            key={i}
            style={{
              color: variant.baseColor,
              WebkitTextStroke: variant.strokeColor ? `2.5px ${variant.strokeColor}` : undefined,
              paintOrder: variant.strokeColor ? 'stroke fill' : undefined,
              opacity: wordOpacity(t, w, fps),
            }}
          >
            {w.text}
          </span>
        );
      }
      if (rule.style === 'color') {
        return (
          <span key={i} style={{ color: rule.color, opacity }}>
            {w.text}
          </span>
        );
      }
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            background: rule.bg,
            color: rule.color,
            borderRadius: 8,
            padding: '0.05em 0.28em',
            opacity,
            transform: `scale(${interpolate(progress, [0, 1], [0.7, 1])})`,
          }}
        >
          {w.text}
        </span>
      );
    })}
  </div>
);

/** Prism — words alternate between plain regular and bold italic, same color throughout. */
const AltWeightItalic: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => (
  <div style={{ fontFamily: variant.fontFamily, fontSize, maxWidth: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', gap: '0.15em' }}>
    {cue.words.map((w, i) => {
      const emphasize = i % 2 === 1;
      return (
        <span
          key={i}
          style={{
            fontStyle: emphasize ? 'italic' : 'normal',
            fontWeight: emphasize ? 800 : 400,
            color: variant.baseColor,
            opacity: wordOpacity(t, w, fps),
          }}
        >
          {w.text}
        </span>
      );
    })}
  </div>
);

/** Runway — a single keyword shown alone on its own rotated sticker box. */
const StickerWord: React.FC<{
  variant: CaptionVariant;
  cue: Cue;
  keywordIndex: number;
  t: number;
  fps: number;
  fontSize: number;
}> = ({ variant, cue, keywordIndex, t, fps, fontSize }) => {
  const word = cue.words[keywordIndex] ?? cue.words[0];
  const progress = spring({ frame: Math.max((t - word.start) * fps, 0), fps, config: { damping: 12 } });
  return (
    <div
      style={{
        display: 'inline-block',
        background: variant.pillColor ?? '#0a0a0a',
        borderRadius: 4,
        padding: '0.15em 0.5em',
        transform: `rotate(-4deg) scale(${interpolate(progress, [0, 1], [0.7, 1])})`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      <span
        style={{
          fontFamily: variant.fontFamily,
          fontWeight: 800,
          fontSize: fontSize * 0.85,
          color: variant.emphasisColor,
        }}
      >
        {word.text}
      </span>
    </div>
  );
};

/** Grace / Leo — one huge word, bold colored fill with a thick black outline, no background box. */
const ImpactOutline: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => {
  const active = cue.words.find((w) => t >= w.start && t <= w.end) ?? cue.words[0];
  const progress = spring({ frame: Math.max((t - active.start) * fps, 0), fps, config: { damping: 9, stiffness: 220 } });
  return (
    <span
      style={{
        fontFamily: variant.fontFamily,
        fontWeight: 900,
        fontSize: fontSize * 1.7,
        color: variant.baseColor,
        WebkitTextStroke: `4px ${variant.strokeColor}`,
        paintOrder: 'stroke fill',
        textTransform: 'uppercase',
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
      }}
    >
      {active.text}
    </span>
  );
};

/** Arion Pink — the cue splits into short lines, each its own pill "bubble", stacking upward. */
const StackedBubbles: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => {
  const lineSize = 3;
  const lines: WordTiming[][] = [];
  for (let i = 0; i < cue.words.length; i += lineSize) lines.push(cue.words.slice(i, i + lineSize));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      {lines.map((line, li) => {
        const lineStart = line[0].start;
        if (t < lineStart) return null;
        const progress = spring({ frame: Math.max((t - lineStart) * fps, 0), fps, config: { damping: 13 } });
        return (
          <div
            key={li}
            style={{
              display: 'inline-flex',
              alignSelf: 'center',
              background: variant.pillColor,
              borderRadius: 10,
              padding: '0.25em 0.55em',
              fontFamily: variant.fontFamily,
              fontSize: fontSize * 0.72,
              opacity: interpolate(progress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(progress, [0, 1], [10, 0])}px) rotate(${li % 2 === 0 ? -1 : 1}deg)`,
            }}
          >
            {line.map((w, wi) => (
              <span key={wi} style={{ color: variant.baseColor, fontWeight: wi === 0 ? 800 : 500, marginRight: '0.25em' }}>
                {w.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Quintessence — one word at a time, centered, large italic serif, no background. */
const SoloItalic: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => {
  const active = cue.words.find((w) => t >= w.start && t <= w.end) ?? cue.words[0];
  const progress = spring({ frame: Math.max((t - active.start) * fps, 0), fps, config: { damping: 14 } });
  return (
    <span
      style={{
        fontFamily: variant.fontFamily,
        fontStyle: 'italic',
        fontWeight: 700,
        color: variant.baseColor,
        fontSize: fontSize * 1.8,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(progress, [0, 1], [0.85, 1])})`,
      }}
    >
      {active.text}
    </span>
  );
};

/** Irena / Travel / Poster / Vitamin A / Million / Omega Red — the whole phrase in one flat color, no per-word split, no box. Wraps across lines for longer phrases. `fontWeightOverride`/`noUppercase` give Million its quiet, plain look. */
const FlatColorPhrase: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => (
  <div
    style={{
      fontFamily: variant.fontFamily,
      fontWeight: variant.fontWeightOverride ?? 800,
      fontSize,
      color: variant.baseColor,
      WebkitTextStroke: variant.strokeColor ? `2.5px ${variant.strokeColor}` : undefined,
      paintOrder: variant.strokeColor ? 'stroke fill' : undefined,
      maxWidth: '85%',
      lineHeight: 1.25,
      textTransform: variant.noUppercase ? 'none' : 'uppercase',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '0.15em'
    }}
  >
    {cue.words.map((w, i) => (
      <span key={i} style={{ opacity: wordOpacity(t, w, fps) }}>
        {w.text}
      </span>
    ))}
  </div>
);

/** Cassiopeia — the first word stays solid, the rest fade to a lighter shade. */
const FadeEmphasis: React.FC<{
  variant: CaptionVariant;
  cue: Cue;
  keywordIndex: number;
  t: number;
  fps: number;
  fontSize: number;
}> = ({ variant, cue, keywordIndex, t, fps, fontSize }) => (
  <div style={{ fontFamily: variant.fontFamily, fontSize, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', gap: '0.15em' }}>
    {cue.words.map((w, i) => (
      <span
        key={i}
        style={{
          color: i === keywordIndex ? variant.baseColor : variant.fadeColor,
          fontWeight: i === keywordIndex ? 700 : 400,
          opacity: wordOpacity(t, w, fps),
        }}
      >
        {w.text}
      </span>
    ))}
  </div>
);

/** Omega Green / Kang / Recipe — color alternates every other word. */
const AltColor: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => (
  <div style={{ fontFamily: variant.fontFamily, fontWeight: 800, fontSize, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', gap: '0.15em' }}>
    {cue.words.map((w, i) => (
      <span
        key={i}
        style={{
          color: i % 2 === 0 ? variant.baseColor : variant.altColorSecondary,
          WebkitTextStroke: variant.strokeColor ? `2.5px ${variant.strokeColor}` : undefined,
          paintOrder: variant.strokeColor ? 'stroke fill' : undefined,
          opacity: wordOpacity(t, w, fps),
        }}
      >
        {w.text}
      </span>
    ))}
  </div>
);

/** Mizar — one word at a time, centered, soft glow, no box and no italic. */
const SoloGlow: React.FC<{ variant: CaptionVariant; cue: Cue; t: number; fps: number; fontSize: number }> = ({
  variant,
  cue,
  t,
  fps,
  fontSize,
}) => {
  const active = cue.words.find((w) => t >= w.start && t <= w.end) ?? cue.words[0];
  const progress = spring({ frame: Math.max((t - active.start) * fps, 0), fps, config: { damping: 16 } });
  const glow = variant.emphasisColor ?? variant.baseColor;
  return (
    <span
      style={{
        fontFamily: variant.fontFamily,
        fontWeight: 600,
        color: variant.baseColor,
        fontSize: fontSize * 1.3,
        textShadow: `0 0 18px ${glow}, 0 0 36px ${glow}`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      }}
    >
      {active.text}
    </span>
  );
};
