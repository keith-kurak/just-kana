import SwiftUI

@main
struct JustKanaApp: App {
    @State private var store = AppStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(store)
                .environment(\.buttonColor, AppColors.options[store.primaryColorIndex])
                .preferredColorScheme(.dark)
                // The Expo app turned off font scaling, because the kana grid
                // is laid out to fit the screen width exactly.
                .dynamicTypeSize(.large)
        }
    }
}

private enum Route: Hashable {
    case words, settings
}

struct RootView: View {
    @Environment(AppStore.self) private var store
    @State private var path: [Route] = []

    var body: some View {
        ZStack {
            NavigationStack(path: $path) {
                MainView(onShowWordList: { path.append(.words) })
                    .toolbar(.hidden, for: .navigationBar)
                    .navigationDestination(for: Route.self) { route in
                        Group {
                            switch route {
                            case .words:
                                WordsView(onBack: pop, onShowSettings: { path.append(.settings) })
                            case .settings:
                                SettingsView(onBack: pop)
                            }
                        }
                        .toolbar(.hidden, for: .navigationBar)
                    }
            }
            WordOfTheDayOverlay()
        }
    }

    private func pop() {
        if !path.isEmpty { path.removeLast() }
    }
}

/// Shows once per launch, but only if common.json marks a word of the day with "highlight".
private struct WordOfTheDayOverlay: View {
    @Environment(AppStore.self) private var store
    @State private var visible = true

    private var word: CommonWord? {
        store.kana.commonWords
            .first { $0.title == "Words of the Day" }?
            .words.first { $0.highlight }
    }

    var body: some View {
        if visible, let word {
            GeometryReader { geo in
                VStack(spacing: 0) {
                    Text("Check out the word of the day")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundStyle(AppColors.buttonText)
                        .padding(.bottom, Sizes.medium)
                    ReadingWord(word: word.word, centered: true)
                    if let translation = word.translation {
                        Text("\"\(translation)\"")
                            .font(.system(size: 18))
                            .italic()
                            .foregroundStyle(AppColors.secondaryText)
                            .padding(.top, Sizes.small)
                    }
                    Button("Cool") { visible = false }
                        .foregroundStyle(AppColors.buttonText)
                        .padding(Sizes.small)
                        .overlay(RoundedRectangle(cornerRadius: Sizes.borderRadius).stroke(AppColors.buttonText, lineWidth: 1))
                        .padding(.vertical, Sizes.medium)
                }
                .padding(Sizes.medium)
                .frame(width: geo.size.width * 0.8, height: 200)
                .background(AppColors.overlaySolid, in: RoundedRectangle(cornerRadius: Sizes.borderRadius))
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }
}
