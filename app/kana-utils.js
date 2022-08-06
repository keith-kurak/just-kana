import { keys,split } from 'lodash';
const katakanaData = require('./katakana.json');

//const kanaArray = keys(katakanaData.katakanaToRomaji).map(key => ({ kana: key, romaji: katakanaData.katakanaToRomaji[key]}))

function getKanaRow(rowLetter) {
  const rowString = katakanaData.katakanaTable[rowLetter];
  const rowKana = split(rowString, '');
  return rowKana.map(kana => ({ kana, romaji: katakanaData.katakanaToRomaji[kana]}))
}

function getKanaTable() {
  const rowConsanants = katakanaData.tableRows;
  const tableRows = [];
  rowConsanants.forEach(consanant => {
    tableRows.push(getKanaRow(consanant));
  })
  return tableRows;
}

export { getKanaTable };
