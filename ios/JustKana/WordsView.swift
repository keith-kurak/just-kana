import SwiftUI
import UIKit

/// A row in the word list. `saved` is set only for the user's own words.
private struct WordItem: Identifiable {
    let id: UUID
    let word: [Kana]
    let translation: String?
    let saved: SavedWord?
}

private struct WordSection: Identifiable {
    let id: String
    let title: String
    let items: [WordItem]
}

struct WordsView: View {
    @Environment(AppStore.self) private var store
    let onBack: () -> Void
    let onShowSettings: () -> Void
    @State private var filterIndex = 0
    @State private var selected: WordItem?
    @State private var translateURL: URL?

    private var sections: [WordSection] {
        if filterIndex == 0 {
            return savedWordSections(store.savedWords)
        }
        return store.kana.commonWords.map { group in
            WordSection(id: group.id.uuidString, title: group.title, items: group.words.map {
                WordItem(id: $0.id, word: $0.word, translation: $0.translation, saved: nil)
            })
        }
    }

    var body: some View {
        ZStack {
            AppColors.background.ignoresSafeArea()
            VStack(spacing: 0) {
                MinimalNavbar(onBack: onBack) {
                    SegmentedControl(options: ["Mine", "Common"], selectedIndex: $filterIndex)
                } right: {
                    Button(action: onShowSettings) {
                        Image(systemName: "gearshape")
                            .font(.system(size: 26))
                            .foregroundStyle(AppColors.buttonText)
                    }
                    .buttonStyle(FadeButtonStyle())
                    .accessibilityLabel("Settings")
                }
                WordList(sections: sections) { selected = $0 }
            }
            if let item = selected {
                WordDetailPanel(
                    word: item.word,
                    canDelete: item.saved != nil,
                    onDismiss: { selected = nil },
                    onSpeak: { store.speak(item.word) },
                    onTranslate: { translateURL = translationURL(item.word) },
                    onCopy: {
                        UIPasteboard.general.string = item.word.map(\.kana).joined()
                            + " (" + item.word.map(\.romaji).joined() + ")"
                        selected = nil
                    },
                    onDelete: {
                        if let saved = item.saved { store.deleteWord(saved) }
                        selected = nil
                    }
                )
            }
        }
        .fullScreenCover(item: $translateURL) { url in
            SafariView(url: url).ignoresSafeArea()
        }
    }

    private func translationURL(_ word: [Kana]) -> URL? {
        var components = URLComponents(string: "https://translate.google.com/")!
        components.queryItems = [
            URLQueryItem(name: "sl", value: "ja"),
            // The Expo app used "auto" on iOS so the Google Translate app handles it right.
            URLQueryItem(name: "tl", value: "auto"),
            URLQueryItem(name: "op", value: "translate"),
            URLQueryItem(name: "text", value: word.map(\.kana).joined()),
        ]
        return components.url
    }
}

private func savedWordSections(_ words: [SavedWord]) -> [WordSection] {
    let withFraction = ISO8601DateFormatter()
    withFraction.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    let plain = ISO8601DateFormatter()
    let keyFormatter = DateFormatter()
    keyFormatter.dateFormat = "yyyy-MM-dd"
    let titleFormatter = DateFormatter()
    titleFormatter.dateStyle = .medium
    titleFormatter.timeStyle = .none

    var order: [String] = []
    var groups: [String: (title: String, items: [WordItem])] = [:]
    for word in words.sorted(by: { $0.date > $1.date }) {
        let date = withFraction.date(from: word.date) ?? plain.date(from: word.date)
        let key = date.map(keyFormatter.string(from:)) ?? ""
        if groups[key] == nil {
            order.append(key)
            groups[key] = (date.map(titleFormatter.string(from:)) ?? "", [])
        }
        groups[key]!.items.append(WordItem(id: word.id, word: word.word, translation: nil, saved: word))
    }
    return order.map { WordSection(id: $0, title: groups[$0]!.title, items: groups[$0]!.items) }
}

private struct WordList: View {
    let sections: [WordSection]
    let onPressWord: (WordItem) -> Void

    var body: some View {
        if sections.isEmpty {
            Text("Go back and add your first word!")
                .font(.system(size: 18))
                .foregroundStyle(AppColors.buttonText)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0) {
                    ForEach(sections) { section in
                        Text(section.title)
                            .font(.system(size: 18))
                            .foregroundStyle(AppColors.secondaryText)
                            .padding(.leading, Sizes.medium)
                        ForEach(Array(section.items.enumerated()), id: \.element.id) { index, item in
                            if index > 0 {
                                Rectangle()
                                    .fill(AppColors.secondaryText)
                                    .frame(height: 1 / UIScreen.main.scale)
                                    .padding(.horizontal, Sizes.medium)
                            }
                            WordRow(item: item) { onPressWord(item) }
                        }
                        Color.clear.frame(height: 20)
                    }
                }
            }
        }
    }
}

private struct WordRow: View {
    let item: WordItem
    let onPress: () -> Void

    var body: some View {
        Button(action: onPress) {
            HStack(spacing: 0) {
                VStack(spacing: Sizes.small) {
                    ReadingWord(word: item.word)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    if let translation = item.translation {
                        Text("\"\(translation)\"")
                            .font(.system(size: 18))
                            .italic()
                            .foregroundStyle(AppColors.secondaryText)
                    }
                }
                .padding(.trailing, Sizes.medium)
                Image(systemName: "ellipsis")
                    .font(.system(size: 20))
                    .foregroundStyle(AppColors.secondaryText)
            }
            .padding(Sizes.medium)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

private struct WordDetailPanel: View {
    let word: [Kana]
    let canDelete: Bool
    let onDismiss: () -> Void
    let onSpeak: () -> Void
    let onTranslate: () -> Void
    let onCopy: () -> Void
    let onDelete: () -> Void

    var body: some View {
        ZStack(alignment: .bottom) {
            AppColors.background.opacity(0.7)
                .ignoresSafeArea()
                .onTapGesture(perform: onDismiss)
            VStack(spacing: Sizes.medium) {
                HStack(spacing: 0) {
                    ToolbarButton(systemImage: "ellipsis.bubble", label: "Speak", action: onSpeak)
                    ToolbarButton(systemImage: "translate", label: "Translate", action: onTranslate)
                    ToolbarButton(systemImage: "doc.on.doc", label: "Copy", action: onCopy)
                    if canDelete {
                        ToolbarButton(systemImage: "trash", label: "Delete", color: AppColors.destructive, action: onDelete)
                    }
                }
                ReadingWord(word: word, centered: true)
                    .frame(maxWidth: .infinity)
            }
            .padding(Sizes.medium)
            .frame(maxWidth: .infinity)
            .background(AppColors.overlay.ignoresSafeArea(edges: .bottom))
        }
    }
}

private struct ToolbarButton: View {
    let systemImage: String
    let label: String
    var color: Color = .white
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: 24))
                .foregroundStyle(color)
                .frame(width: 60, height: 50)
                .overlay(RoundedRectangle(cornerRadius: Sizes.borderRadius).stroke(color, lineWidth: 1))
        }
        .buttonStyle(FadeButtonStyle())
        .padding(.horizontal, Sizes.medium)
        .accessibilityLabel(label)
    }
}
