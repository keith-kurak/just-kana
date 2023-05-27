import { keys, split } from 'lodash';
const katakanaData = require('./katakana.json');
const hiraganaData = require('./hiragana.json');
const commonWords = require('./common.json');

type Character = {
  kana: string;
  romaji: string;
  gojuonRowIndex?: number;
  consonant: string;
};

type KanaRow = [Character?];

type KanaTable = [KanaRow?];

function generateKanaProvider(data) {
  const kanaData = data;

  function getGojuonRow(rowLetter : string, isMainGojuon = true) : KanaRow {
    const rowString = kanaData.kanaTable[rowLetter];
    const rowKana = split(rowString, '');
    return rowKana.map((kana, index) =>
      kana !== ' ' ? { kana, romaji: kanaData.kanaToRomaji[kana], gojuonRowIndex: isMainGojuon ? index : undefined, consonant: rowLetter } : null
    );
  }

  function getMonographs() : KanaTable {
    const rowConsanants = kanaData.tableRows;
    const tableRows : KanaTable = [];
    rowConsanants.forEach((consanant) => {
      tableRows.push(getGojuonRow(consanant, true));
    });
    return tableRows;
  }

  function gojuonRowIndexToConsonant(index) {
    return kanaData.tableRows[index];
  }

  function getDiacriticRowsForMonographRow(rowLetter) : KanaTable {
    const alternateRows = kanaData.alternateRows[rowLetter];
    if (alternateRows) {
      return alternateRows.map((row) => getGojuonRow(row, false));
    }
    return [];
  }

  function getDiacriticConsonantsForMonographRow(rowLetter) : [string?] {
    const alternateRows = kanaData.alternateRows[rowLetter];
    if (alternateRows) {
      return alternateRows;
    }
    return [];
  }

  function getAllFormsForKana(character: Character) : Character[] {
    const mainRow = getGojuonRow(character.consonant, true);
    const alternateRows = getDiacriticRowsForMonographRow(character.consonant);

    const column = mainRow.findIndex((c) => c.kana === character.kana);

    return [character].concat(alternateRows.map((row) => row[column]));
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
  }
}

const katakanaProvider = generateKanaProvider(katakanaData);
const hiraganaProvider = generateKanaProvider(hiraganaData);

const anyKanaToRomaji = (kana) => {
  if (kana === ' ') return ' ';
  if (kana === 'ー') return 'ー';
  if (kana === 'ッ') return 'ッ';

  let romaji = katakanaData.kanaToRomaji[kana];
  if (!romaji) {
    romaji = hiraganaData.kanaToRomaji[kana];
  }
  return romaji;
}

commonWords.forEach((group) => {
  group.data.forEach((entry) => {
    entry.word = entry.word.split('');
    entry.word = entry.word.map((l) => ({  kana: l, romaji: anyKanaToRomaji(l) }));
  });
});

export { katakanaProvider, hiraganaProvider, commonWords };
