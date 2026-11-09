import AVFoundation
import Foundation
import Observation

/// A word the user saved.
struct SavedWord: Codable, Identifiable {
    var id = UUID()
    var word: [Kana]
    /// ISO-8601 local date-time with offset, e.g. 2023-02-12T01:14:22.721-05:00
    var date: String
    var isHiragana: Bool

    private enum CodingKeys: String, CodingKey { case word, date, isHiragana }
}

let colorOptionCount = 5

/// App state and persistence. Words are kept in a JSON file; settings in UserDefaults.
@MainActor
@Observable
final class AppStore {
    let kana = KanaRepository.shared

    private(set) var savedWords: [SavedWord] = []
    private(set) var showVowelsAndConsonants: Bool
    private(set) var primaryColorIndex: Int
    private(set) var kanaType: KanaType = .katakana

    /// The word the user is typing now.
    private(set) var typingKana: [Kana] = []

    @ObservationIgnored private let speech = AVSpeechSynthesizer()
    @ObservationIgnored private let defaults = UserDefaults.standard

    private static let wordsURL: URL = {
        let dir = URL.applicationSupportDirectory
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appending(path: "saved_words.json")
    }()

    init() {
        showVowelsAndConsonants = defaults.object(forKey: "showVowelsAndConsonants") as? Bool ?? true
        primaryColorIndex = min(max(defaults.integer(forKey: "primaryColorIndex"), 0), colorOptionCount - 1)
        if let data = try? Data(contentsOf: Self.wordsURL),
           let words = try? JSONDecoder().decode([SavedWord].self, from: data) {
            savedWords = words
        }
    }

    // MARK: Typing

    func type(_ kana: Kana) { typingKana.append(kana) }

    func backspace() {
        if !typingKana.isEmpty { typingKana.removeLast() }
    }

    func typeSpace() { type(Kana(kana: " ", romaji: " ")) }

    /// Chōonpu (ー) and sokuon (ッ/っ) marks have no romaji of their own.
    func typeMark(_ mark: String) { type(Kana(kana: mark, romaji: "")) }

    func saveTypedWord() {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = .current
        savedWords.append(SavedWord(word: typingKana, date: formatter.string(from: .now), isHiragana: kanaType == .hiragana))
        typingKana = []
        persistWords()
    }

    // MARK: Words

    func deleteWord(_ word: SavedWord) {
        savedWords.removeAll { $0.id == word.id }
        persistWords()
    }

    func deleteAllWords() {
        savedWords = []
        persistWords()
    }

    /// One line per word: kana,romaji,yyyy-mm-dd
    func wordsAsText() -> String {
        savedWords.map { w in
            w.word.map(\.kana).joined() + "," + w.word.map(\.romaji).joined() + ","
                + (w.date.split(separator: "T").first.map(String.init) ?? "")
        }
        .map { $0 + "\n" }
        .joined()
    }

    func speak(_ word: [Kana]) {
        let utterance = AVSpeechUtterance(string: word.map(\.romaji).joined())
        utterance.voice = AVSpeechSynthesisVoice(language: "ja-JP")
        speech.stopSpeaking(at: .immediate)
        speech.speak(utterance)
    }

    // MARK: Settings

    func toggleVowelsAndConsonants() {
        showVowelsAndConsonants.toggle()
        defaults.set(showVowelsAndConsonants, forKey: "showVowelsAndConsonants")
    }

    func cycleColor() {
        primaryColorIndex = (primaryColorIndex + 1) % colorOptionCount
        defaults.set(primaryColorIndex, forKey: "primaryColorIndex")
    }

    func toggleKanaType() {
        kanaType = kanaType == .hiragana ? .katakana : .hiragana
    }

    // MARK: Persistence

    private func persistWords() {
        guard let data = try? JSONEncoder().encode(savedWords) else { return }
        try? data.write(to: Self.wordsURL, options: .atomic)
    }
}
