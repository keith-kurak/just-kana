# Just Some Kana (native)

That's all it is, just some kana, you know!

Find foreign/ loan words in Japanese text, sound them out, add them to your collection!

This branch has two separate native apps. There is no JavaScript code.

| Folder     | Platform | Stack                                  |
| ---------- | -------- | -------------------------------------- |
| `ios/`     | iOS 17+  | SwiftUI, Xcode project `JustKana`      |
| `android/` | Android  | Kotlin, Jetpack Compose, Gradle        |

The root `app.json`, `package.json`, and `eas.json` are there only so that EAS Build can build the apps.
The kana tables and common words are JSON files. Each app has its own copy:
`ios/JustKana/Resources/` and `android/app/src/main/assets/`.

## Building with EAS

```sh
# Simulator / emulator builds (no signing credentials needed)
eas build --profile simulator --platform all

# Internal distribution (APK on Android)
eas build --profile preview --platform all

# Store builds
eas build --profile production --platform all
```

The iOS project has no CocoaPods dependencies. The `ios/Podfile` exists only because EAS Build runs `pod install`.

## Building locally

- iOS: open `ios/JustKana.xcodeproj` in Xcode and run the `JustKana` scheme.
- Android: open `android/` in Android Studio, or run `./gradlew :app:assembleDebug` in `android/`.
