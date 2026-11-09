import SwiftUI

struct MainView: View {
    @Environment(AppStore.self) private var store
    let onShowWordList: () -> Void
    /// The kana that is held down; its other forms show in an overlay.
    @State private var longPressKana: Kana?

    var body: some View {
        GeometryReader { geo in
            let insets = geo.safeAreaInsets
            let provider = store.kana.provider(store.kanaType)
            ZStack(alignment: .top) {
                AppColors.background
                KanaGrid(
                    provider: provider,
                    showConsonants: store.showVowelsAndConsonants,
                    topInset: insets.top,
                    bottomInset: insets.bottom,
                    onPressKana: { store.type($0) },
                    onLongPressKana: { longPressKana = $0 }
                )
                if let kana = longPressKana {
                    KanaFormsOverlay(
                        forms: provider.allForms(kana),
                        showConsonants: store.showVowelsAndConsonants,
                        screenWidth: geo.size.width,
                        onPressKana: {
                            store.type($0)
                            longPressKana = nil
                        },
                        onRequestHide: { longPressKana = nil }
                    )
                }
                if !store.typingKana.isEmpty {
                    VStack {
                        Spacer()
                        TypingBar(bottomInset: insets.bottom)
                    }
                }
                TopBar(topInset: insets.top, width: geo.size.width, onShowWordList: onShowWordList)
            }
            .ignoresSafeArea()
        }
    }
}

// MARK: - Kana grid

private struct KanaGrid: View {
    @Environment(\.buttonColor) private var buttonColor
    let provider: KanaProvider
    let showConsonants: Bool
    let topInset: CGFloat
    let bottomInset: CGFloat
    let onPressKana: (Kana) -> Void
    let onLongPressKana: (Kana) -> Void

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                Color.clear.frame(height: topInset + Sizes.expandedTopBar)
                ForEach(Array(provider.monographs.enumerated()), id: \.offset) { index, row in
                    let consonant = provider.tableRows[index]
                    KanaRow(
                        items: row,
                        consonant: consonant,
                        alternateConsonants: provider.diacriticConsonants(consonant),
                        showConsonant: showConsonants,
                        color: buttonColor.darken(0.02 * Double(index)).color,
                        onPressKana: onPressKana,
                        onLongPressKana: onLongPressKana
                    )
                }
                Color.clear.frame(height: 240 + bottomInset)
            }
        }
        .scrollIndicators(.hidden)
    }
}

private struct KanaRow: View {
    let items: [Kana?]
    let consonant: String
    let alternateConsonants: [String]
    let showConsonant: Bool
    let color: Color
    let onPressKana: (Kana) -> Void
    let onLongPressKana: (Kana) -> Void

    var body: some View {
        HStack(spacing: 0) {
            Text(!showConsonant || consonant.hasPrefix("~") ? " " : consonant)
                .font(.system(size: 16))
                .foregroundStyle(AppColors.secondaryText)
                .frame(width: Sizes.verticalKey)
            HStack(alignment: .top, spacing: 0) {
                ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                    if index > 0 { Spacer(minLength: 0) }
                    if let item {
                        KanaCell(kana: item, color: color, showConsonant: showConsonant,
                                 onPress: { onPressKana(item) }, onLongPress: { onLongPressKana(item) })
                    } else {
                        Color.clear.frame(width: Sizes.kanaButtonDiameter, height: Sizes.kanaButtonDiameter)
                    }
                }
            }
            .padding(.vertical, Sizes.small)
            if alternateConsonants.isEmpty {
                Color.clear.frame(width: Sizes.verticalKey, height: 1)
            } else {
                DakutenIndicator(consonants: alternateConsonants, showConsonant: showConsonant)
            }
        }
    }
}

/// ン has no row of its own, so it gets an "(n)" hint under it.
private struct KanaCell: View {
    let kana: Kana
    let color: Color
    let showConsonant: Bool
    let onPress: () -> Void
    let onLongPress: () -> Void

    var body: some View {
        VStack(spacing: Sizes.small) {
            KanaButton(text: kana.kana, color: color, onPress: onPress, onLongPress: onLongPress)
            if (kana.kana == "ン" || kana.kana == "ん") && showConsonant {
                Text("(n)").font(.system(size: 16)).foregroundStyle(AppColors.secondaryText)
            }
        }
    }
}

struct KanaButton<Label: View>: View {
    let color: Color
    let onPress: () -> Void
    let onLongPress: (() -> Void)?
    let label: Label
    /// Set when a long press fires, so the tap that ends it does not also type the kana.
    @State private var didLongPress = false

    init(color: Color, onPress: @escaping () -> Void, onLongPress: (() -> Void)? = nil,
         @ViewBuilder label: () -> Label) {
        self.color = color
        self.onPress = onPress
        self.onLongPress = onLongPress
        self.label = label()
    }

    var body: some View {
        Button {
            if didLongPress {
                didLongPress = false
                return
            }
            onPress()
        } label: {
            Circle()
                .fill(color)
                .frame(width: Sizes.kanaButtonDiameter, height: Sizes.kanaButtonDiameter)
                .overlay { label }
        }
        .buttonStyle(FadeButtonStyle())
        .simultaneousGesture(
            // The Expo app opened the forms overlay after a 200 ms hold.
            LongPressGesture(minimumDuration: 0.2).onEnded { _ in
                guard let onLongPress else { return }
                didLongPress = true
                onLongPress()
            }
        )
    }
}

extension KanaButton where Label == AnyView {
    init(text: String, color: Color, onPress: @escaping () -> Void, onLongPress: (() -> Void)? = nil) {
        self.init(color: color, onPress: onPress, onLongPress: onLongPress) {
            AnyView(
                Text(text)
                    .font(.system(size: text.count > 1 ? 22 : 30))
                    .foregroundStyle(AppColors.buttonText)
            )
        }
    }
}

/// Shows that a row has dakuten (゛) / handakuten (゜) forms, or their consonants.
private struct DakutenIndicator: View {
    let consonants: [String]
    let showConsonant: Bool

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(consonants.enumerated()), id: \.offset) { index, symbol in
                Text(showConsonant ? symbol : (index == 0 ? "゛" : index == 1 ? "゜" : ""))
                    .font(.system(size: showConsonant ? 10 : 20))
                    .foregroundStyle(AppColors.secondaryText)
                    .padding(.leading, showConsonant ? 0 : 5)
            }
        }
        .frame(width: Sizes.verticalKey, height: Sizes.kanaButtonDiameter)
    }
}

// MARK: - Forms overlay

private struct KanaFormsOverlay: View {
    @Environment(\.buttonColor) private var buttonColor
    let forms: [Kana]
    let showConsonants: Bool
    let screenWidth: CGFloat
    let onPressKana: (Kana) -> Void
    let onRequestHide: () -> Void

    /// Forms grouped by consonant, in first-seen order.
    private var groups: [[Kana]] {
        var order: [String] = []
        var byConsonant: [String: [Kana]] = [:]
        for kana in forms {
            if byConsonant[kana.consonant] == nil { order.append(kana.consonant) }
            byConsonant[kana.consonant, default: []].append(kana)
        }
        return order.map { byConsonant[$0]! }
    }

    var body: some View {
        let spaceBetween = max(screenWidth / 6 - Sizes.kanaButtonDiameter, 0)
        ZStack {
            AppColors.background.opacity(0.9)
            VStack(spacing: Sizes.small) {
                VStack(spacing: 0) {
                    ForEach(Array(groups.enumerated()), id: \.offset) { _, group in
                        HStack(spacing: 0) {
                            ForEach(Array(group.enumerated()), id: \.offset) { index, kana in
                                VStack(spacing: Sizes.small) {
                                    if showConsonants {
                                        Text(kana.romaji).font(.system(size: 16)).foregroundStyle(AppColors.buttonText)
                                    }
                                    KanaButton(
                                        text: kana.kana,
                                        color: (index == 0 ? buttonColor : buttonColor.darken(0.1)).color,
                                        onPress: { onPressKana(kana) }
                                    )
                                }
                                .padding(.horizontal, spaceBetween / 2)
                            }
                        }
                        .padding(.vertical, Sizes.small)
                    }
                }
                .frame(minWidth: 150)
                .background(AppColors.overlaySolid, in: RoundedRectangle(cornerRadius: Sizes.borderRadius))
                KanaButton(color: AppColors.destructive, onPress: onRequestHide) {
                    Image(systemName: "xmark")
                        .font(.system(size: 24, weight: .medium))
                        .foregroundStyle(AppColors.buttonText)
                }
                .accessibilityLabel("Close")
            }
        }
        .contentShape(Rectangle())
        .onTapGesture(perform: onRequestHide)
    }
}

// MARK: - Typing bar

private struct TypingBar: View {
    @Environment(AppStore.self) private var store
    let bottomInset: CGFloat

    var body: some View {
        HStack {
            KeyboardKey(action: store.backspace) {
                Image(systemName: "arrow.left").font(.system(size: 26))
            }
            .accessibilityLabel("Delete last kana")
            Spacer()
            HStack(spacing: Sizes.medium) {
                let sokuon = store.kanaType == .katakana ? "ッ" : "っ"
                KeyboardKey(action: { store.typeMark(sokuon) }) { Text(sokuon).font(.system(size: 30)) }
                KeyboardKey(action: { store.typeMark("ー") }) { Text("ー").font(.system(size: 30)) }
                KeyboardKey(width: 75, action: store.typeSpace) { Color.clear }
                    .accessibilityLabel("Space")
            }
            Spacer()
            KeyboardKey(action: store.saveTypedWord) {
                Image(systemName: "plus").font(.system(size: 26))
            }
            .accessibilityLabel("Save word")
        }
        .padding(.horizontal, Sizes.large)
        .padding(.bottom, bottomInset)
        .frame(maxWidth: .infinity)
        .background(AppColors.overlay)
    }
}

private struct KeyboardKey<Content: View>: View {
    var width: CGFloat?
    let action: () -> Void
    @ViewBuilder var content: Content

    var body: some View {
        Button(action: action) {
            content
                .foregroundStyle(.white)
                .padding(.horizontal, Sizes.small)
                .frame(minWidth: 44)
                .frame(width: width, height: 44)
                .overlay(RoundedRectangle(cornerRadius: Sizes.borderRadius).stroke(.white, lineWidth: 1))
        }
        .buttonStyle(FadeButtonStyle())
        .padding(.vertical, Sizes.medium)
    }
}

// MARK: - Top bar

private struct TopBar: View {
    @Environment(AppStore.self) private var store
    let topInset: CGFloat
    let width: CGFloat
    let onShowWordList: () -> Void

    var body: some View {
        let typing = !store.typingKana.isEmpty
        VStack(spacing: 0) {
            Color.clear.frame(height: topInset)
            if typing {
                TypedWord(typingKana: store.typingKana, width: width)
            } else {
                Toolbar(onShowWordList: onShowWordList)
            }
            Spacer(minLength: 0)
        }
        .frame(height: Sizes.expandedTopBar + topInset)
        .frame(maxWidth: .infinity)
        .overlay(alignment: .bottom) {
            if store.showVowelsAndConsonants {
                HStack(spacing: 0) {
                    ForEach(Array(["a", "i", "u", "e", "o"].enumerated()), id: \.offset) { index, vowel in
                        if index > 0 { Spacer(minLength: 0) }
                        Text(vowel)
                            .font(.system(size: 16))
                            .foregroundStyle(AppColors.secondaryText)
                            .frame(width: Sizes.kanaButtonDiameter)
                    }
                }
                .padding(.horizontal, Sizes.verticalKey)
                .padding(.bottom, Sizes.small)
            }
        }
        .background(typing ? AppColors.overlay : AppColors.background.opacity(0x99 / 255))
    }
}

private struct Toolbar: View {
    @Environment(AppStore.self) private var store
    @Environment(\.buttonColor) private var buttonColor
    let onShowWordList: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            Button(action: store.toggleVowelsAndConsonants) {
                Text("aiueo")
                    .font(.system(size: 26))
                    .italic()
                    .foregroundStyle(store.showVowelsAndConsonants ? buttonColor.color : AppColors.secondaryText)
            }
            .buttonStyle(FadeButtonStyle())
            Button(action: store.cycleColor) {
                Circle()
                    .fill(buttonColor.color)
                    .overlay(Circle().stroke(AppColors.buttonText, lineWidth: 2))
                    .frame(width: 32, height: 32)
            }
            .buttonStyle(FadeButtonStyle())
            .padding(.leading, Sizes.medium)
            .accessibilityLabel("Change color")
            KanaTypeSwitcher()
                .padding(.leading, Sizes.medium)
            Spacer()
            Button(action: onShowWordList) {
                Text("カナ")
                    .font(.system(size: 18))
                    .foregroundStyle(AppColors.buttonText)
                    .padding(.vertical, 5)
                    .padding(.horizontal, 10)
                    .overlay(RoundedRectangle(cornerRadius: Sizes.borderRadius).stroke(AppColors.buttonText, lineWidth: 2))
            }
            .buttonStyle(FadeButtonStyle())
            .accessibilityIdentifier("show-word-list-button")
            .overlay(alignment: .topTrailing) {
                let count = store.savedWords.count
                if count > 0 {
                    Text("\(count)")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundStyle(AppColors.buttonText)
                        .padding(.horizontal, 3)
                        .frame(minWidth: 26, minHeight: 26)
                        .background(buttonColor.color, in: Capsule())
                        .offset(x: 10, y: -10)
                        .allowsHitTesting(false)
                }
            }
        }
        .padding(.horizontal, Sizes.large)
        .frame(height: Sizes.topBar)
    }
}

private struct KanaTypeSwitcher: View {
    @Environment(AppStore.self) private var store
    @Environment(\.buttonColor) private var buttonColor

    var body: some View {
        Button(action: store.toggleKanaType) {
            VStack(spacing: 3) {
                Text("カタカナ")
                    .foregroundStyle(store.kanaType == .katakana ? buttonColor.color : AppColors.secondaryText)
                Rectangle().fill(AppColors.secondaryText).frame(width: 26, height: 1)
                Text("ひらがな")
                    .foregroundStyle(store.kanaType == .hiragana ? buttonColor.color : AppColors.secondaryText)
            }
            .font(.system(size: 10))
        }
        .buttonStyle(FadeButtonStyle())
    }
}

private struct TypedWord: View {
    let typingKana: [Kana]
    let width: CGFloat

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView(.horizontal) {
                HStack(alignment: .center, spacing: 0) {
                    ForEach(Array(typingKana.enumerated()), id: \.offset) { _, kana in
                        ReadingKana(kana: kana)
                    }
                    BlinkingCursor()
                        .frame(maxHeight: .infinity, alignment: .bottom)
                        .id("end")
                }
                .fixedSize(horizontal: false, vertical: true)
                .padding(.horizontal, Sizes.medium)
                .frame(minWidth: width)
            }
            .scrollIndicators(.hidden)
            .onChange(of: typingKana.count) {
                proxy.scrollTo("end", anchor: .trailing)
            }
        }
    }
}

private struct BlinkingCursor: View {
    @State private var faded = false

    var body: some View {
        Rectangle()
            .fill(AppColors.buttonText)
            .frame(width: 26, height: 2)
            .padding(.horizontal, 2)
            .opacity(faded ? 0 : 1)
            .onAppear {
                withAnimation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true)) {
                    faded = true
                }
            }
    }
}
