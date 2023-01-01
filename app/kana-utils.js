import { keys, split } from 'lodash';
const katakanaData = require('./katakana.json');

//const kanaArray = keys(katakanaData.katakanaToRomaji).map(key => ({ kana: key, romaji: katakanaData.katakanaToRomaji[key]}))

function getKanaRow(rowLetter) {
  const rowString = katakanaData.katakanaTable[rowLetter];
  const rowKana = split(rowString, '');
  return rowKana.map((kana) =>
    kana !== ' ' ? { kana, romaji: katakanaData.katakanaToRomaji[kana] } : null
  );
}

function getKanaTable() {
  const rowConsanants = katakanaData.tableRows;
  const tableRows = [];
  rowConsanants.forEach((consanant) => {
    tableRows.push(getKanaRow(consanant));
  });
  return tableRows;
}

function rowIndexToConsonant(index) {
  return katakanaData.tableRows[index];
}

function getAlternateKanaRows(rowLetter) {
  const alternateRows = katakanaData.alternateRows[rowLetter];
  if (alternateRows) {
    return alternateRows.map((row) => getKanaRow(row));
  }
  return [];
}

function getAlternateKanaRowConsonants(rowLetter) {
  const alternateRows = katakanaData.alternateRows[rowLetter];
  if (alternateRows) {
    return alternateRows;
  }
  return [];
}

// new structure:
/*
  [
    { sets: [

    ]}
  ]

  set:
  {
    kana: 'あ',
    romaji: 'a',

  }
*/

export { getKanaTable, rowIndexToConsonant, getAlternateKanaRows, getAlternateKanaRowConsonants };
