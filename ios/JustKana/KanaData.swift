import Foundation

/// One kana character (or a yōon pair such as キャ) with its romaji reading.
struct Kana: Codable, Hashable {
    var kana: String
    var romaji: String
    /// Gojūon row letter, e.g. "k". Empty for kana that are not from the table. Not saved.
    var consonant: String = ""

    private enum CodingKeys: String, CodingKey { case kana, romaji }
}

enum KanaType {
    case katakana, hiragana
}

/// The JSON shape of katakana.json and hiragana.json.
private struct KanaTableData: Decodable {
    let kanaToRomaji: [String: String]
    let tableRows: [String]
    let alternateRows: [String: [String]]
    let kanaTable: [String: String]
    let yoonTable: [String: [String]]
}

/// Gives the gojūon table and the alternate forms (dakuten, handakuten, yōon) for one script.
final class KanaProvider {
    private let data: KanaTableData
    let monographs: [[Kana?]]

    var tableRows: [String] { data.tableRows }
    var kanaToRomaji: [String: String] { data.kanaToRomaji }

    fileprivate init(resource: String) {
        data = loadJSON(resource, as: KanaTableData.self)
        var rows: [[Kana?]] = []
        for letter in data.tableRows {
            rows.append(Self.row(letter, data: data))
        }
        monographs = rows
    }

    /// A row of 5 cells. A nil cell is a gap in the table.
    private static func row(_ letter: String, data: KanaTableData) -> [Kana?] {
        (data.kanaTable[letter] ?? "").map { char in
            let kana = String(char)
            return kana == " " ? nil : Kana(kana: kana, romaji: data.kanaToRomaji[kana] ?? "", consonant: letter)
        }
    }

    func diacriticConsonants(_ letter: String) -> [String] {
        data.alternateRows[letter] ?? []
    }

    /// The base kana, then its dakuten/handakuten forms, then the yōon forms of all of those.
    func allForms(_ kana: Kana) -> [Kana] {
        let mainRow = Self.row(kana.consonant, data: data)
        guard let column = mainRow.firstIndex(where: { $0?.kana == kana.kana }) else { return [kana] }
        var forms = [kana]
        for letter in diacriticConsonants(kana.consonant) {
            let row = Self.row(letter, data: data)
            if column < row.count, let k = row[column] { forms.append(k) }
        }
        var yoon: [Kana] = []
        for base in forms {
            for y in data.yoonTable[base.kana] ?? [] {
                yoon.append(Kana(kana: y, romaji: data.kanaToRomaji[y] ?? "", consonant: base.consonant))
            }
        }
        return forms + yoon
    }
}

struct CommonWord: Identifiable {
    let id = UUID()
    let word: [Kana]
    let translation: String?
    let highlight: Bool
}

struct WordGroup: Identifiable {
    let id = UUID()
    let title: String
    let words: [CommonWord]
}

private struct RawGroup: Decodable {
    struct Entry: Decodable {
        let word: String
        let translation: String?
        let highlight: Bool?
        let commaDelimited: Bool?
    }
    let title: String
    let data: [Entry]
}

/// Static kana data, loaded once from the bundle.
final class KanaRepository {
    static let shared = KanaRepository()

    let katakana = KanaProvider(resource: "katakana")
    let hiragana = KanaProvider(resource: "hiragana")
    private(set) var commonWords: [WordGroup] = []

    private init() {
        let raw = loadJSON("common", as: [RawGroup].self)
        commonWords = raw.map { group in
            WordGroup(title: group.title, words: group.data.map { entry in
                // Yōon pairs are two characters, so those entries are comma delimited.
                let parts = entry.commaDelimited == true
                    ? entry.word.split(separator: ",").map(String.init)
                    : entry.word.map { String($0) }
                return CommonWord(
                    word: parts.map { Kana(kana: $0, romaji: anyKanaToRomaji($0)) },
                    translation: entry.translation,
                    highlight: entry.highlight ?? false
                )
            })
        }
    }

    func provider(_ type: KanaType) -> KanaProvider {
        type == .katakana ? katakana : hiragana
    }

    private func anyKanaToRomaji(_ kana: String) -> String {
        switch kana {
        case " ", "ー", "ッ": return kana
        default: return katakana.kanaToRomaji[kana] ?? hiragana.kanaToRomaji[kana] ?? ""
        }
    }
}

private func loadJSON<T: Decodable>(_ name: String, as type: T.Type) -> T {
    guard let url = Bundle.main.url(forResource: name, withExtension: "json"),
          let data = try? Data(contentsOf: url),
          let value = try? JSONDecoder().decode(T.self, from: data)
    else {
        fatalError("Missing or invalid bundled resource \(name).json")
    }
    return value
}
