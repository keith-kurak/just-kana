package com.keithkurak.justkana.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.dp
import com.keithkurak.justkana.data.AppStore
import com.keithkurak.justkana.data.CommonWord

private enum class Screen { Main, Words, Settings }

@Composable
fun AppRoot(store: AppStore) {
    // The Expo app turned off font scaling for almost all text, because the
    // kana grid is laid out to fit the screen width exactly.
    val density = LocalDensity.current
    CompositionLocalProvider(LocalDensity provides Density(density.density, fontScale = 1f)) {
        MaterialTheme(colorScheme = darkColorScheme(background = AppColors.background)) {
            ProvideButtonColor(store.primaryColorIndex) {
                Navigation(store)
                WordOfTheDayOverlay(store)
            }
        }
    }
}

@Composable
private fun Navigation(store: AppStore) {
    var stack by rememberSaveable { mutableStateOf(listOf(Screen.Main)) }
    val push = { s: Screen -> stack = stack + s }
    val pop = { stack = stack.dropLast(1) }

    BackHandler(enabled = stack.size > 1) { pop() }

    when (stack.last()) {
        Screen.Main -> MainScreen(store, onShowWordList = { push(Screen.Words) })
        Screen.Words -> WordsScreen(store, onBack = pop, onShowSettings = { push(Screen.Settings) })
        Screen.Settings -> SettingsScreen(store, onBack = pop)
    }
}

/** Shows once per launch, but only if common.json marks a word of the day with "highlight". */
@Composable
private fun WordOfTheDayOverlay(store: AppStore) {
    val word: CommonWord = store.kanaRepository.commonWords
        .firstOrNull { it.title == "Words of the Day" }
        ?.words?.firstOrNull { it.highlight }
        ?: return
    var visible by rememberSaveable { mutableStateOf(true) }
    if (!visible) return

    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(
            Modifier
                .fillMaxWidth(0.8f)
                .height(200.dp)
                .background(AppColors.overlaySolid, RoundedCornerShape(Sizes.borderRadius))
                .padding(Sizes.medium),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = androidx.compose.foundation.layout.Arrangement.Center,
        ) {
            Text(
                "Check out the word of the day",
                style = TextStyles.smallDark,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = Sizes.medium),
            )
            ReadingWord(word.word)
            word.translation?.let {
                Text(
                    "\"$it\"",
                    style = TextStyles.smallLight,
                    fontStyle = FontStyle.Italic,
                    modifier = Modifier.padding(top = Sizes.small),
                )
            }
            Text(
                "Cool",
                color = AppColors.buttonText,
                modifier = Modifier
                    .padding(vertical = Sizes.medium)
                    .pressable { visible = false }
                    .border(1.dp, AppColors.buttonText, RoundedCornerShape(Sizes.borderRadius))
                    .padding(Sizes.small),
            )
        }
    }
}
