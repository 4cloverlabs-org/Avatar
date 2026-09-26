import React from 'react';
import { CAPTION_VARIANTS } from '../remotion/captions/styleTokens';
import styles from './CaptionStylePicker.module.css';

interface CaptionStylePickerProps {
  selectedId: string;
  onSelect: (styleId: string) => void;
}

export const CaptionStylePicker: React.FC<CaptionStylePickerProps> = ({ selectedId, onSelect }) => (
  <div className={styles.grid}>
    {CAPTION_VARIANTS.map((variant) => {
      const isSelected = variant.id === selectedId;
      const isNone = variant.id === 'none';
      return (
        <button
          key={variant.id}
          type="button"
          className={`${styles.tile} ${isSelected ? styles.selected : ''}`}
          onClick={() => onSelect(variant.id)}
          aria-pressed={isSelected}
        >
          <div className={styles.previewArea}>
            {isNone ? (
              <span className={styles.noneIcon} aria-hidden="true" />
            ) : (
              <span
                className={`${styles.previewText}`}
                style={{
                  fontFamily: '"Arial Black", Inter, sans-serif',
                  fontWeight: 900,
                  color: variant.activeTextColor,
                  background: variant.highlightMode === 'box' ? variant.highlightColor : 'transparent',
                  padding: variant.highlightMode === 'box' ? '0.1em 0.3em' : 0,
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  WebkitTextStroke: variant.strokeColor && variant.highlightMode === 'color' ? `1px ${variant.strokeColor}` : undefined,
                }}
              >
                BAKERY
              </span>
            )}
          </div>
          <span className={styles.label}>{variant.name}</span>
        </button>
      );
    })}
  </div>
);