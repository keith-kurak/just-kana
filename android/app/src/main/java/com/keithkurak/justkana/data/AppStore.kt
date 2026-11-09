package com.keithkurak.justkana.data

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit
import java.util.concurrent.Executors

/**
 * A word the user saved. Identity (not value) equality, so that deleting one
 * entry never removes a different entry with the same content.
 */
class SavedWord(
    val word: List<Kana>,
    /** ISO-8601 local date-time with offset, e.g. 2023-02-12T01:14:22.721-05:00 */
    val date: String,
    val isHiragana: Boolean,
)

const val COLOR_OPTION_COUNT = 5

/** App state and persistence. Data is kept in JSON files in the app's files directory. */
class AppStore(app: Application) : AndroidViewModel(app) {
    val kanaRepository = KanaRepository(app)

    private val wordsFile = File(app.filesDir, "saved_words.json")
    private val settingsFile = File(app.filesDir, "settings.json")
    private val ioExecutor = Executors.newSingleThreadExecutor()

    var savedWords by mutableStateOf(loadWords())
        private set
    var showVowelsAndConsonants by mutableStateOf(true)
        private set
    var primaryColorIndex by mutableStateOf(0)
        private set
    var kanaType by mutableStateOf(KanaType.Katakana)
        private set

    /** The word the user is typing now. */
    var typingKana by mutableStateOf(listOf<Kana>())
        private set

    init {
        loadSettings()
    }

    // region typing

    fun type(kana: Kana) {
        typingKana = typingKana + kana
    }

    fun backspace() {
        typingKana = typingKana.dropLast(1)
    }

    fun typeSpace() = type(Kana(" ", " "))

    /** Chōonpu (ー) and sokuon (ッ/っ) marks have no romaji of their own. */
    fun typeMark(mark: String) = type(Kana(mark, ""))

    fun saveTypedWord() {
        addWord(typingKana)
        typingKana = emptyList()
    }

    // endregion

    // region words

    private fun addWord(word: List<Kana>) {
        val date = OffsetDateTime.now().truncatedTo(ChronoUnit.MILLIS).toString()
        savedWords = savedWords + SavedWord(word, date, kanaType == KanaType.Hiragana)
        persistWords()
    }

    fun deleteWord(word: SavedWord) {
        savedWords = savedWords.filter { it !== word }
        persistWords()
    }

    fun deleteAllWords() {
        savedWords = emptyList()
        persistWords()
    }

    /** One line per word: kana,romaji,yyyy-mm-dd */
    fun wordsAsText(): String = buildString {
        savedWords.forEach { w ->
            append(w.word.joinToString("") { it.kana })
            append(',')
            append(w.word.joinToString("") { it.romaji })
            append(',')
            append(w.date.substringBefore('T'))
            append('\n')
        }
    }

    // endregion

    // region settings

    fun toggleVowelsAndConsonants() {
        showVowelsAndConsonants = !showVowelsAndConsonants
        persistSettings()
    }

    fun cycleColor() {
        primaryColorIndex = (primaryColorIndex + 1) % COLOR_OPTION_COUNT
        persistSettings()
    }

    fun toggleKanaType() {
        kanaType = if (kanaType == KanaType.Hiragana) KanaType.Katakana else KanaType.Hiragana
    }

    // endregion

    // region persistence

    private fun loadWords(): List<SavedWord> = runCatching {
        if (!wordsFile.exists()) return emptyList()
        val json = JSONArray(wordsFile.readText())
        (0 until json.length()).map { i ->
            val o = json.getJSONObject(i)
            val kanaJson = o.getJSONArray("word")
            SavedWord(
                word = (0 until kanaJson.length()).map { j ->
                    val k = kanaJson.getJSONObject(j)
                    Kana(k.getString("kana"), k.getString("romaji"))
                },
                date = o.getString("date"),
                isHiragana = o.optBoolean("isHiragana"),
            )
        }
    }.getOrDefault(emptyList())

    private fun persistWords() {
        val json = JSONArray()
        savedWords.forEach { w ->
            json.put(
                JSONObject()
                    .put("word", JSONArray().apply {
                        w.word.forEach { put(JSONObject().put("kana", it.kana).put("romaji", it.romaji)) }
                    })
                    .put("date", w.date)
                    .put("isHiragana", w.isHiragana)
            )
        }
        write(wordsFile, json.toString())
    }

    private fun loadSettings() {
        runCatching {
            if (!settingsFile.exists()) return
            val json = JSONObject(settingsFile.readText())
            showVowelsAndConsonants = json.optBoolean("showVowelsAndConsonants", true)
            primaryColorIndex = json.optInt("primaryColorIndex", 0).coerceIn(0, COLOR_OPTION_COUNT - 1)
        }
    }

    private fun persistSettings() {
        val json = JSONObject()
            .put("showVowelsAndConsonants", showVowelsAndConsonants)
            .put("primaryColorIndex", primaryColorIndex)
        write(settingsFile, json.toString())
    }

    private fun write(file: File, text: String) {
        ioExecutor.execute {
            val tmp = File(file.parentFile, file.name + ".tmp")
            tmp.writeText(text)
            tmp.renameTo(file)
        }
    }

    override fun onCleared() {
        ioExecutor.shutdown()
    }

    // endregion
}
