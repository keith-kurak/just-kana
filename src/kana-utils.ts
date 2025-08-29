import { split } from 'lodash';
const katakanaData = require('./katakana.json');
const hiraganaData = require('./hiragana.json');
const commonWords = require('./common.json');

type Character = {
  kana: string;
  romaji: string;
  gojuonRowIndex?: number;
  consonant: string;
};

type Blank = undefined; // blanks define where we shouldn't show a kana in the table

type KanaRow = (Character | Blank)[];

type KanaTable = KanaRow[];

type KanaData = {
  kanaToRomaji: any;
  tableRows: string[];
  alternateRows: any;
  kanaTable: any;
  yoonTable: any;
};

function generateKanaProvider(data: KanaData) {
  const kanaData = data;

  function getGojuonRow(rowLetter: string, isMainGojuon = true): KanaRow {
    const rowString = kanaData.kanaTable[rowLetter];
    const rowKana = split(rowString, '');
    return rowKana.map((kana, index) =>
      kana !== ' '
        ? {
            kana,
            romaji: kanaData.kanaToRomaji[kana],
            gojuonRowIndex: isMainGojuon ? index : undefined,
            consonant: rowLetter,
          }
        : undefined
    );
  }

  function getMonographs(): KanaTable {
    const rowConsanants = kanaData.tableRows;
    const tableRows: KanaTable = [];
    rowConsanants.forEach((consanant) => {
      tableRows.push(getGojuonRow(consanant, true));
    });
    return tableRows;
  }

  function gojuonRowIndexToConsonant(index: number) {
    return kanaData.tableRows[index];
  }

  function getDiacriticRowsForMonographRow(rowLetter: string): KanaTable {
    const alternateRows = kanaData.alternateRows[rowLetter];
    if (alternateRows) {
      return alternateRows.map((row: string) => getGojuonRow(row, false));
    }
    return [];
  }

  function getDiacriticConsonantsForMonographRow(rowLetter: string): [string?] {
    const alternateRows = kanaData.alternateRows[rowLetter];
    if (alternateRows) {
      return alternateRows;
    }
    return [];
  }

  function getAllFormsForKana(character: Character): Character[] {
    const mainRow = getGojuonRow(character.consonant, true);

    const alternateRows = getDiacriticRowsForMonographRow(character.consonant);

    const column = mainRow.findIndex((c) => c && c.kana === character.kana);

    const monographsPlusDiacritics = [character].concat(
      alternateRows.map((row) => row[column]).filter((r) => !!r)
    );

    const yoonToAdd: Character[] = [];
    monographsPlusDiacritics.forEach((c) => {
      const yoon = kanaData.yoonTable[c.kana] || [];
      yoon.forEach((y: string) => {
        yoonToAdd.push({ kana: y, romaji: kanaData.kanaToRomaji[y], consonant: c.consonant });
      });
    });

    return monographsPlusDiacritics.concat(yoonToAdd);
  }

  return {
    getMonographs,
    gojuonRowIndexToConsonant,
    getDiacriticRowsForMonographRow,
    getDiacriticConsonantsForMonographRow,
    // legacy compatibility from when I didn't know the names of things
    getKanaTable: getMonographs,
    getAlternateKanaRows: getDiacriticRowsForMonographRow,
    getAlternateKanaRowConsonants: getDiacriticConsonantsForMonographRow,
    rowIndexToConsonant: gojuonRowIndexToConsonant,
    getAllFormsForKana,
  };
}

const katakanaProvider = generateKanaProvider(katakanaData);
const hiraganaProvider = generateKanaProvider(hiraganaData);

const anyKanaToRomaji = (kana: string) => {
  if (kana === ' ') return ' ';
  if (kana === 'ー') return 'ー';
  if (kana === 'ッ') return 'ッ';

  let romaji = katakanaData.kanaToRomaji[kana];
  if (!romaji) {
    romaji = hiraganaData.kanaToRomaji[kana];
  }
  return romaji;
};

commonWords.forEach((group: any) => {
  group.data.forEach((entry: any) => {
    // hack to get around it not detecting the yoon characters
    if (entry.commaDelimited) {
      entry.word = entry.word.split(',');
      entry.word = entry.word.map((l: string) => ({ kana: l, romaji: anyKanaToRomaji(l) }));
    } else {
      entry.word = entry.word.split('');
      entry.word = entry.word.map((l: string) => ({ kana: l, romaji: anyKanaToRomaji(l) }));
    }
  });
});

export { katakanaProvider, hiraganaProvider, commonWords };
