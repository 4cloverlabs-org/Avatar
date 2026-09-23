import { CaptionSegment, WordTiming } from '../types/captions';
 
interface WhisperWord {
  word: string;
  start: number;
  end: number;
}
 
interface GroupingOptions {
  /** Max words per caption cue. Default 6. */
  maxWords?: number;
  /** Max cue duration in seconds. Default 2.5. */
  maxDuration?: number;
  /** Gap between words (seconds) that forces a new cue, e.g. a pause in speech. Default 0.6. */
  pauseThreshold?: number;
}
 
/**
 * Groups raw word-level timestamps (as returned by Whisper's verbose_json
 * `words` array) into caption cues suitable for on-screen display, splitting
 * on natural pauses, a max word count, or a max cue duration — whichever
 * comes first.
 */
export function whisperToCaptions(words: WhisperWord[], options: GroupingOptions = {}): CaptionSegment[] {
  const { maxWords = 6, maxDuration = 2.5, pauseThreshold = 0.6 } = options;
 
  const segments: CaptionSegment[] = [];
  let current: WordTiming[] = [];
 
  const flush = () => {
    if (current.length === 0) return;
    segments.push({
      id: `cue-${segments.length}`,
      start: current[0].start,
      end: current[current.length - 1].end,
      words: current,
    });
    current = [];
  };
 
  words.forEach((raw, i) => {
    const word: WordTiming = { text: raw.word.trim(), start: raw.start, end: raw.end };
    const prev = current[current.length - 1];
 
    const gapTooBig = prev ? word.start - prev.end > pauseThreshold : false;
    const durationTooLong = current.length > 0 && word.end - current[0].start > maxDuration;
    const tooManyWords = current.length >= maxWords;
 
    if (gapTooBig || durationTooLong || tooManyWords) {
      flush();
    }
    current.push(word);
 
    if (i === words.length - 1) flush();
  });
 
  return segments;
}