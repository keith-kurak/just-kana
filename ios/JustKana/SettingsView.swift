import SwiftUI
import UIKit

struct SettingsView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.buttonColor) private var buttonColor
    let onBack: () -> Void

    @State private var confirmDelete = false
    @State private var confirmDeleteAgain = false
    @State private var message: String?
    @State private var shareURL: URL?

    private var version: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? ""
    }

    private var build: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? ""
    }

    var body: some View {
        VStack(spacing: 0) {
            MinimalNavbar(onBack: onBack)
            VStack {
                Spacer()
                SettingsSection(title: "Export words", subtitle: "Save your learned words for posterity.") {
                    SettingsButton(title: "Copy all to clipboard", color: buttonColor.color) {
                        UIPasteboard.general.string = store.wordsAsText()
                        message = "Copied!"
                    }
                    SettingsButton(title: "Export all to text file", color: buttonColor.color, action: exportFile)
                }
                Spacer()
                SettingsSection(
                    title: "Delete all words",
                    subtitle: "Restart with a blank slate.",
                    warning: "This cannot be undone!"
                ) {
                    SettingsButton(title: "Delete everything", color: AppColors.destructive) {
                        confirmDelete = true
                    }
                }
                Spacer()
            }
            versionInfo
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AppColors.background.ignoresSafeArea())
        .alert("Really delete all words?", isPresented: $confirmDelete) {
            Button("Yes, Delete", role: .destructive) {
                // Show the second alert after the first one is dismissed.
                DispatchQueue.main.async { confirmDeleteAgain = true }
            }
            Button("No", role: .cancel) {}
        } message: {
            Text("This cannot be undone")
        }
        .alert("Are you sure?", isPresented: $confirmDeleteAgain) {
            Button("Yes, Delete!!", role: .destructive) {
                store.deleteAllWords()
                DispatchQueue.main.async { message = "All words deleted!" }
            }
            Button("No", role: .cancel) {}
        }
        .alert(message ?? "", isPresented: Binding(get: { message != nil }, set: { if !$0 { message = nil } })) {
            Button("OK", role: .cancel) {}
        }
        .sheet(item: $shareURL) { url in
            ActivityView(items: [url])
                .presentationDetents([.medium, .large])
        }
    }

    private var versionInfo: some View {
        VStack(spacing: 0) {
            Text("Version info")
                .font(.system(size: 18))
                .foregroundStyle(AppColors.buttonText)
            Text(version)
            Text(build)
        }
        .font(.system(size: 14))
        .foregroundStyle(AppColors.secondaryText)
        .padding(.bottom, Sizes.medium)
        .contentShape(Rectangle())
        .onLongPressGesture {
            UIPasteboard.general.string = "v. \(version) b. \(build)"
            message = "Version info copied!"
        }
    }

    private func exportFile() {
        let url = FileManager.default.temporaryDirectory.appending(path: "kanaexport.txt")
        do {
            try store.wordsAsText().write(to: url, atomically: true, encoding: .utf8)
            shareURL = url
        } catch {
            message = "Could not export words."
        }
    }
}

private struct SettingsSection<Content: View>: View {
    let title: String
    let subtitle: String
    var warning: String?
    @ViewBuilder var content: Content

    var body: some View {
        VStack(spacing: Sizes.small) {
            Text(title).font(.system(size: 26)).foregroundStyle(AppColors.buttonText)
            Text(subtitle).font(.system(size: 18)).foregroundStyle(AppColors.secondaryText)
                .multilineTextAlignment(.center)
            if let warning {
                Text(warning).font(.system(size: 18)).foregroundStyle(AppColors.destructive)
            }
            content
        }
    }
}

private struct SettingsButton: View {
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 18))
                .foregroundStyle(AppColors.buttonText)
                .padding(Sizes.medium)
                .background(color, in: RoundedRectangle(cornerRadius: Sizes.borderRadius))
        }
        .buttonStyle(FadeButtonStyle())
        .padding(.top, Sizes.small)
    }
}
