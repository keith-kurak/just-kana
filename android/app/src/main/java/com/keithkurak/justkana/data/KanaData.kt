package com.keithkurak.justkana.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/** One kana character (or a yōon pair such as キャ) with its romaji reading. */
data class Kana(
    val kana: String,
    val romaji: String,
    /** Gojūon row letter, e.g. "k". Empty for kana that are not from the table. */
    val consonant: String = "",
)

enum class KanaType { Katakana, Hiragana }

/**
 * Gives the gojūon table and the alternate forms (dakuten, handakuten, yōon)
 * for one script. Built from katakana.json or hiragana.json.
 */
class KanaProvider(json: JSONObject) {
    val kanaToRomaji: Map<String, String> = json.getJSONObject("kanaToRomaji").toStringMap()
    val tableRows: List<String> = json.getJSONArray("tableRows").toStringList()
    private val alternateRows: Map<String, List<String>> =
        json.getJSONObject("alternateRows").toListMap()
    private val kanaTable: Map<String, String> = json.getJSONObject("kanaTable").toStringMap()
    private val yoonTable: Map<String, List<String>> = json.getJSONObject("yoonTable").toListMap()

    /** A row of 5 cells. A null cell is a gap in the table. */
    fun row(rowLetter: String): List<Kana?> =
        kanaTable.getValue(rowLetter).map { c ->
            val kana = c.toString()
            if (kana == " ") null else Kana(kana, kanaToRomaji[kana] ?: "", rowLetter)
        }

    val monographs: List<List<Kana?>> by lazy { tableRows.map { row(it) } }

    fun diacriticConsonants(rowLetter: String): List<String> = alternateRows[rowLetter] ?: emptyList()

    /** The base kana, then its dakuten/handakuten forms, then the yōon forms of all of those. */
    fun allForms(kana: Kana): List<Kana> {
        val mainRow = row(kana.consonant)
        val column = mainRow.indexOfFirst { it?.kana == kana.kana }
        val withDiacritics = listOf(kana) +
            diacriticConsonants(kana.consonant).mapNotNull { row(it).getOrNull(column) }
        val yoon = withDiacritics.flatMap { base ->
            (yoonTable[base.kana] ?: emptyList()).map { Kana(it, kanaToRomaji[it] ?: "", base.consonant) }
        }
        return withDiacritics + yoon
    }
}

data class CommonWord(
    val word: List<Kana>,
    val translation: String?,
    val highlight: Boolean,
)

data class WordGroup(val title: String, val words: List<CommonWord>)

class KanaRepository(context: Context) {
    val katakana = KanaProvider(JSONObject(context.readAsset("katakana.json")))
    val hiragana = KanaProvider(JSONObject(context.readAsset("hiragana.json")))
    val commonWords: List<WordGroup> = loadCommonWords(JSONArray(context.readAsset("common.json")))

    fun provider(type: KanaType) = if (type == KanaType.Katakana) katakana else hiragana

    private fun anyKanaToRomaji(kana: String): String = when (kana) {
        " ", "ー", "ッ" -> kana
        else -> katakana.kanaToRomaji[kana] ?: hiragana.kanaToRomaji[kana] ?: ""
    }

    private fun loadCommonWords(json: JSONArray): List<WordGroup> =
        (0 until json.length()).map { i ->
            val group = json.getJSONObject(i)
            val data = group.getJSONArray("data")
            WordGroup(
                title = group.getString("title"),
                words = (0 until data.length()).map { j ->
                    val entry = data.getJSONObject(j)
                    val raw = entry.getString("word")
                    // Yōon pairs are two characters, so those entries are comma delimited.
                    val parts = if (entry.optBoolean("commaDelimited")) raw.split(",")
                    else raw.map { it.toString() }
                    CommonWord(
                        word = parts.map { Kana(it, anyKanaToRomaji(it)) },
                        translation = entry.optString("translation").takeIf { it.isNotEmpty() },
                        highlight = entry.optBoolean("highlight"),
                    )
                },
            )
        }
}

private fun Context.readAsset(name: String) = assets.open(name).bufferedReader().use { it.readText() }

private fun JSONObject.toStringMap(): Map<String, String> =
    keys().asSequence().associateWith { getString(it) }

private fun JSONObject.toListMap(): Map<String, List<String>> =
    keys().asSequence().associateWith { getJSONArray(it).toStringList() }

private fun JSONArray.toStringList(): List<String> = (0 until length()).map { getString(it) }
