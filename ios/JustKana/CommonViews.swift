import SafariServices
import SwiftUI

/// A kana with its romaji under it. A space is shown as a gap.
struct ReadingKana: View {
    let kana: Kana

    var body: some View {
        if kana.kana == " " {
            Color.clear.frame(width: 30, height: 1)
        } else {
            VStack(spacing: 0) {
                Text(kana.kana).font(.system(size: 30))
                Text(kana.romaji).font(.system(size: 18))
            }
            .foregroundStyle(AppColors.buttonText)
        }
    }
}

/// Kana of a word in a wrapping row.
struct ReadingWord: View {
    let word: [Kana]
    var centered = false

    var body: some View {
        FlowLayout(centered: centered) {
            ForEach(Array(word.enumerated()), id: \.offset) { _, kana in
                ReadingKana(kana: kana)
            }
        }
    }
}

/// A simple left-to-right wrapping layout.
struct FlowLayout: Layout {
    var centered = false

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = rows(width: proposal.width ?? .infinity, subviews: subviews)
        let width = rows.map(\.width).max() ?? 0
        let height = rows.map(\.height).reduce(0, +)
        return CGSize(width: proposal.width.map { min($0, width) } ?? width, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var y = bounds.minY
        for row in rows(width: bounds.width, subviews: subviews) {
            var x = centered ? bounds.minX + (bounds.width - row.width) / 2 : bounds.minX
            for index in row.indices {
                let size = subviews[index].sizeThatFits(.unspecified)
                subviews[index].place(at: CGPoint(x: x, y: y + (row.height - size.height) / 2), proposal: .unspecified)
                x += size.width
            }
            y += row.height
        }
    }

    private struct Row {
        var indices: [Int] = []
        var width: CGFloat = 0
        var height: CGFloat = 0
    }

    private func rows(width maxWidth: CGFloat, subviews: Subviews) -> [Row] {
        var rows: [Row] = [Row()]
        for (index, subview) in subviews.enumerated() {
            let size = subview.sizeThatFits(.unspecified)
            if rows[rows.count - 1].width + size.width > maxWidth, !rows[rows.count - 1].indices.isEmpty {
                rows.append(Row())
            }
            rows[rows.count - 1].indices.append(index)
            rows[rows.count - 1].width += size.width
            rows[rows.count - 1].height = max(rows[rows.count - 1].height, size.height)
        }
        return rows.filter { !$0.indices.isEmpty }
    }
}

/// The simple header used on secondary screens: back arrow, optional center and right items.
struct MinimalNavbar<Center: View, Right: View>: View {
    let onBack: () -> Void
    @ViewBuilder var center: Center
    @ViewBuilder var right: Right

    var body: some View {
        ZStack {
            HStack {
                Button(action: onBack) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 28, weight: .regular))
                        .foregroundStyle(AppColors.buttonText)
                        .frame(width: 40, height: 40)
                }
                .buttonStyle(FadeButtonStyle())
                .accessibilityLabel("Back")
                Spacer()
                right
            }
            center
        }
        .frame(height: 56)
        .padding(.horizontal, 8)
    }
}

extension MinimalNavbar where Center == EmptyView, Right == EmptyView {
    init(onBack: @escaping () -> Void) {
        self.init(onBack: onBack, center: { EmptyView() }, right: { EmptyView() })
    }
}

struct SegmentedControl: View {
    let options: [String]
    @Binding var selectedIndex: Int

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(options.enumerated()), id: \.offset) { index, option in
                let selected = index == selectedIndex
                Button {
                    selectedIndex = index
                } label: {
                    Text(option)
                        .font(.system(size: 12))
                        .foregroundStyle(selected ? AppColors.background : AppColors.buttonText)
                        .padding(Sizes.small)
                        .background(selected ? AppColors.buttonText : AppColors.background)
                }
                .buttonStyle(FadeButtonStyle())
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: Sizes.borderRadius))
        .overlay(RoundedRectangle(cornerRadius: Sizes.borderRadius).stroke(AppColors.buttonText, lineWidth: 1))
    }
}

/// In-app browser, like expo-web-browser's openBrowserAsync.
struct SafariView: UIViewControllerRepresentable {
    let url: URL

    func makeUIViewController(context: Context) -> SFSafariViewController {
        SFSafariViewController(url: url)
    }

    func updateUIViewController(_ controller: SFSafariViewController, context: Context) {}
}

/// The system share sheet.
struct ActivityView: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ controller: UIActivityViewController, context: Context) {}
}

extension URL: @retroactive Identifiable {
    public var id: String { absoluteString }
}
