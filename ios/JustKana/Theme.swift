import SwiftUI

/// An sRGB color that can be darkened the same way as colord's darken() (HSL lightness).
struct RGB {
    var r: Double, g: Double, b: Double, a: Double = 1

    init(hex: UInt32, alpha: Double = 1) {
        r = Double((hex >> 16) & 0xFF) / 255
        g = Double((hex >> 8) & 0xFF) / 255
        b = Double(hex & 0xFF) / 255
        a = alpha
    }

    private init(r: Double, g: Double, b: Double, a: Double) {
        self.r = r; self.g = g; self.b = b; self.a = a
    }

    var color: Color { Color(.sRGB, red: r, green: g, blue: b, opacity: a) }

    func darken(_ amount: Double) -> RGB {
        guard amount != 0 else { return self }
        let maxC = max(r, g, b), minC = min(r, g, b)
        let l = (maxC + minC) / 2
        let d = maxC - minC
        var h = 0.0, s = 0.0
        if d != 0 {
            s = d / (1 - abs(2 * l - 1))
            if maxC == r { h = 60 * ((g - b) / d).truncatingRemainder(dividingBy: 6) }
            else if maxC == g { h = 60 * ((b - r) / d + 2) }
            else { h = 60 * ((r - g) / d + 4) }
            if h < 0 { h += 360 }
        }
        return Self.fromHSL(h: h, s: min(max(s, 0), 1), l: min(max(l - amount, 0), 1), a: a)
    }

    private static func fromHSL(h: Double, s: Double, l: Double, a: Double) -> RGB {
        let c = (1 - abs(2 * l - 1)) * s
        let x = c * (1 - abs((h / 60).truncatingRemainder(dividingBy: 2) - 1))
        let m = l - c / 2
        let (r1, g1, b1): (Double, Double, Double)
        switch h {
        case ..<60: (r1, g1, b1) = (c, x, 0)
        case ..<120: (r1, g1, b1) = (x, c, 0)
        case ..<180: (r1, g1, b1) = (0, c, x)
        case ..<240: (r1, g1, b1) = (0, x, c)
        case ..<300: (r1, g1, b1) = (x, 0, c)
        default: (r1, g1, b1) = (c, 0, x)
        }
        return RGB(r: r1 + m, g: g1 + m, b: b1 + m, a: a)
    }
}

/// The app is always dark (the Expo app set userInterfaceStyle to "dark").
enum AppColors {
    static let background = Color(red: 0x22 / 255, green: 0x22 / 255, blue: 0x22 / 255)
    static let buttonText = Color.white
    static let secondaryText = Color(red: 0xA9 / 255, green: 0xA9 / 255, blue: 0xA9 / 255)
    static let overlay = RGB(hex: 0x7F7F7F, alpha: 0xBB / 255).color
    static let overlaySolid = RGB(hex: 0x7F7F7F).color
    static let destructive = Color(red: 1, green: 0x3B / 255, blue: 0x30 / 255)

    static let options: [RGB] = [
        RGB(hex: 0x076FF8),
        RGB(hex: 0xF89007),
        RGB(hex: 0x9007F8),
        RGB(hex: 0xF8076F),
        RGB(hex: 0x05AE65),
    ]
}

enum Sizes {
    static let verticalKey: CGFloat = 32
    static let topBar: CGFloat = 56
    static let expandedTopBar: CGFloat = 100
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let kanaButtonDiameter: CGFloat = 50
    static let borderRadius: CGFloat = 5
}

/// The current primary color, chosen with the color button in the toolbar.
private struct ButtonColorKey: EnvironmentKey {
    static let defaultValue = AppColors.options[0]
}

extension EnvironmentValues {
    var buttonColor: RGB {
        get { self[ButtonColorKey.self] }
        set { self[ButtonColorKey.self] = newValue }
    }
}

/// The "fade to 50% while pressed" feedback the Expo app used.
struct FadeButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.5 : 1)
            .contentShape(Rectangle())
    }
}
