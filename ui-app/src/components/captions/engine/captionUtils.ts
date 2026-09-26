import { WordTiming, CaptionsData, CaptionLine } from './types';

export function groupWordsIntoLines(words: WordTiming[], maxChars: number = 30): CaptionsData {
  const lines: CaptionLine[] = [];
  let currentWords: WordTiming[] = [];
  let currentLength = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLen = word.text.length;

    // If adding this word exceeds maxChars AND we already have words in the line, push the line
    if (currentLength + wordLen > maxChars && currentWords.length > 0) {
      lines.push({ words: currentWords });
      currentWords = [word];
      currentLength = wordLen;
    } else {
      currentWords.push(word);
      currentLength += wordLen + 1; // +1 for the space
    }
  }

  if (currentWords.length > 0) {
    lines.push({ words: currentWords });
  }

  return { lines };
}
