import React from 'react';
import { Player } from '@remotion/player';
import { CAPTION_VARIANTS } from './variants';
import { CaptionsAiCaption, WordTiming } from './CaptionsAiCaption';
import styles from './CaptionsAiPicker.module.css';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

const THUMBNAIL_WORDS: WordTiming[] = [
  { text: 'Create', start: 0, end: 0.8 },
  { text: 'AI', start: 0.8, end: 1.6 },
  { text: 'videos', start: 1.6, end: 3.0 },
];

const ThumbnailComposition: React.FC<{ variantId: string }> = ({ variantId }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CaptionsAiCaption
        words={THUMBNAIL_WORDS}
        variantId={variantId}
        keywordIndex={1}
        fontSize={68}
        position="thumbnail"
      />
    </div>
  );
};

export const CaptionsAiPicker: React.FC<Props> = ({ selectedId, onSelect }) => (
  <div className={styles.grid}>
    {CAPTION_VARIANTS.map((v) => (
      <button
        key={v.id}
        type="button"
        className={`${styles.card} ${v.id === selectedId ? styles.selected : ''}`}
        onClick={() => onSelect(v.id)}
      >
        <div className={styles.thumb}>
          {v.id !== 'none' && (
            <Player
              component={ThumbnailComposition}
              inputProps={{ variantId: v.id }}
              durationInFrames={90}
              fps={30}
              compositionWidth={720}
              compositionHeight={1280}
              style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
              loop
              autoPlay
            />
          )}
        </div>
        <span className={styles.label}>{v.name}</span>
      </button>
    ))}
  </div>
);
