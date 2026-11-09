package com.keithkurak.justkana.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/** The app is always dark (the Expo app set userInterfaceStyle to "dark"). */
object AppColors {
    val background = Color(0xFF222222)
    val buttonText = Color.White
    val secondaryText = Color(0xFFA9A9A9)
    val overlay = Color(0xBB7F7F7F)
    val overlaySolid = Color(0xFF7F7F7F)
    val destructive = Color(0xFFFF3B30)

    val colorOptions = listOf(
        Color(0xFF076FF8),
        Color(0xFFF89007),
        Color(0xFF9007F8),
        Color(0xFFF8076F),
        Color(0xFF05AE65),
    )
}

object Sizes {
    val verticalKey = 32.dp
    val topBar = 56.dp
    val expandedTopBar = 100.dp
    val small = 8.dp
    val medium = 12.dp
    val large = 16.dp
    val kanaButtonDiameter = 50.dp
    val borderRadius = 5.dp
}

/** The current primary color, chosen with the color button in the toolbar. */
val LocalButtonColor = staticCompositionLocalOf { AppColors.colorOptions[0] }

@Composable
fun ProvideButtonColor(colorIndex: Int, content: @Composable () -> Unit) {
    CompositionLocalProvider(
        LocalButtonColor provides AppColors.colorOptions[colorIndex.coerceIn(0, AppColors.colorOptions.size - 1)],
        content = content,
    )
}

/** Lowers HSL lightness by [amount] (0..1), the same as colord's darken(). */
fun Color.darken(amount: Float): Color {
    if (amount == 0f) return this
    val r = red; val g = green; val b = blue
    val maxC = max(r, max(g, b)); val minC = min(r, min(g, b))
    val l = (maxC + minC) / 2f
    val d = maxC - minC
    var h = 0f
    var s = 0f
    if (d != 0f) {
        s = d / (1f - abs(2f * l - 1f))
        h = when (maxC) {
            r -> 60f * (((g - b) / d) % 6f)
            g -> 60f * ((b - r) / d + 2f)
            else -> 60f * ((r - g) / d + 4f)
        }
        if (h < 0) h += 360f
    }
    return Color.hsl(h, s.coerceIn(0f, 1f), (l - amount).coerceIn(0f, 1f), alpha)
}
