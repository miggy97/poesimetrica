export interface wordsInVerse {
  id: string;
  word: string;
  key: number;
}

export interface verseInStanza {
  id: string;
  lastWord: string;
  color: string;
  applyColor: number;
  isEmpty: boolean;
  consonatRhyme: string;
  assonanceRhyme: string;
  meterSyllables: number;
  totalSyllables: number;
  key: number;
}

export interface verseColor {
  consonatRhyme: string;
  assonantRhyme: string;
  ids: string[];
  color: number;
}
