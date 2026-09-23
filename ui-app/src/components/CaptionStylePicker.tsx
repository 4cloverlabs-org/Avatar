import React from 'react';
import { CAPTION_STYLES } from '../remotion/captions/styleTokens';
import styles from './CaptionStylePicker.module.css';
 
interface CaptionStylePickerProps {
  selectedId: string;
  onSelect: (styleId: string) => void;
}
 
/** Short sample text shown inside each tile — kept generic on purpose. */
const previewText: Record<string, string> = {
  'hormozi': 'BAKERY',
  'karaoke': 'BAKERY',
  'bounce': 'BAKERY',
  'slide': 'BAKERY',
  'typewriter': 'Hey, did you',
  'highlight': 'WILLOW CREEK',
  'cinematic': 'Bakery',
};
 
export const CaptionStylePicker: React.FC<CaptionStylePickerProps> = ({ selectedId, onSelect }) => (
  <div className={styles.grid}>
    {CAPTION_STYLES.map((token) => {
      const isSelected = token.id === selectedId;
      const isNone = token.id === 'none';
      return (
        <button
          key={token.id}
          type="button"
          className={`${styles.tile} ${isSelected ? styles.selected : ''}`}
          onClick={() => onSelect(token.id)}
          aria-pressed={isSelected}
        >
          <div className={styles.previewArea}>
            {isNone ? (
              <span className={styles.noneIcon} aria-hidden="true" />
            ) : (
              <span
                className={`${styles.previewText} ${styles[token.animationType]}`}
                style={{
                  fontFamily: token.fontFamily,
                  fontWeight: token.fontWeight,
                  color: token.textColor,
                  background: token.background,
                  fontStyle: token.italic ? 'italic' : 'normal',
                  textTransform: token.uppercase ? 'uppercase' : 'none',
                  WebkitTextStroke: token.strokeColor ? `1.5px ${token.strokeColor}` : undefined,
                }}
              >
                {previewText[token.id] ?? token.name}
              </span>
            )}
          </div>
          <span className={styles.label}>{token.name}</span>
        </button>
      );
    })}
  </div>
);