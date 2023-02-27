import { keys, split } from 'lodash';
const katakanaData = require('./katakana.json');
const hiraganaData = require('./hiragana.json');
const commonWords = require('./common.json');

function generateKanaProvider(data) {
  const kanaData = data;

  function getKanaRow(rowLetter) {
    const rowString = kanaData.kanaTable[rowLetter];
    const rowKana = split(rowString, '');
    return rowKana.map((kana) =>
      kana !== ' ' ? { kana, romaji: kanaData.kanaToRomaji[kana] } : null
    );
  }

  function getKanaTable() {
    const rowConsanants = kanaData.tableRows;
    const tableRows = [];
    rowConsanants.forEach((consanant) => {
      tableRows.push(getKanaRow(consanant));
    });
    return tableRows;
  }

  function rowIndexToConsonant(index) {
    return kanaData.tableRows[index];
  }

  function getAlternateKanaRows(rowLetter) {
    const alternateRows = kanaData.alternateRows[rowLetter];
    if (alternateRows) {
      return alternateRows.map((row) => getKanaRow(row));
    }
    return [];
  }

  function getAlternateKanaRowConsonants(rowLetter) {
    const alternateRows = kanaData.alternateRows[rowLetter];
    if (alternateRows) {
      return alternateRows;
    }
    return [];
  }

  return {
    getKanaTable,
    rowIndexToConsonant,
    getAlternateKanaRows,
    getAlternateKanaRowConsonants,
  }
}

const katakanaProvider = generateKanaProvider(katakanaData);
const hiraganaProvider = generateKanaProvider(hiraganaData);

const anyKanaToRomaji = (kana) => {
  if (kana === ' ') return ' ';
  if (kana === 'ー') return 'ー';

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
    console.log(entry);
  });
});

export { katakanaProvider, hiraganaProvider, commonWords };
