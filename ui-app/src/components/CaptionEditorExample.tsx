import React, { useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { CaptionsAiPicker } from './captions/CaptionsAiPicker';
import { CaptionLayer } from '../remotion/captions/CaptionLayer';
import { whisperToCaptions } from '../lib/whisperToCaptions';
import { CaptionTrackConfig } from '../types/captions';
 
// Stand-in for whatever your Whisper transcription step returns per clip.
export const SAMPLE_WHISPER_WORDS = [
  { word: 'Hey,', start: 0.0, end: 0.3 },
  { word: 'did', start: 0.35, end: 0.5 },
  { word: 'you', start: 0.5, end: 0.65 },
  { word: 'hear', start: 0.65, end: 0.9 },
  { word: 'about', start: 0.95, end: 1.2 },
  { word: 'the', start: 1.25, end: 1.35 },
  { word: 'bakery', start: 1.4, end: 1.9 },
];

import { CaptionsAiCaption } from './captions/CaptionsAiCaption';

/** Minimal composition that overlays the selected caption style on a solid background. */
export const CaptionPreviewComposition: React.FC<{
  segments?: any;
  config?: any;
}> = ({ config }) => {
  // Shift the sample words back by 0.5s so the animations are already 
  // complete at t=0. This prevents the preview from being completely blank
  // when the player is paused at the start!
  const previewWords = SAMPLE_WHISPER_WORDS.map(w => ({ 
    text: w.word, 
    start: w.start - 0.5, 
    end: w.end - 0.5 
  }));
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CaptionsAiCaption 
        words={previewWords}
        variantId={config?.styleId || 'pulse'}
        keywordIndex={0}
        position={config?.position || 'bottom'}
      />
    </div>
  );
};
 
/**
 * Drop this into your editor's caption panel. Swap SAMPLE_WHISPER_WORDS for
 * the real transcription result for the selected clip.
 */
export const CaptionEditorExample: React.FC = () => {
  const [styleId, setStyleId] = useState('pulse');
  const segments = useMemo(() => whisperToCaptions(SAMPLE_WHISPER_WORDS), []);
  const config: CaptionTrackConfig = { styleId, position: 'bottom' };
 
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: 220 }}>
        <CaptionsAiPicker selectedId={styleId} onSelect={setStyleId} />
      </div>
 
      <div style={{ width: 320, aspectRatio: '9 / 16' }}>
        <Player
          component={CaptionPreviewComposition}
          inputProps={{ segments, config }}
          durationInFrames={90}
          fps={30}
          compositionWidth={720}
          compositionHeight={1280}
          controls
          loop
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};