package com.keithkurak.justkana.ui

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalViewConfiguration
import androidx.compose.ui.platform.ViewConfiguration
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.keithkurak.justkana.data.AppStore
import com.keithkurak.justkana.data.Kana
import com.keithkurak.justkana.data.KanaProvider
import com.keithkurak.justkana.data.KanaType
import kotlinx.coroutines.delay

@Composable
fun MainScreen(store: AppStore, onShowWordList: () -> Unit) {
    val provider = store.kanaRepository.provider(store.kanaType)
    // The kana that is held down; its other forms show in an overlay.
    var longPressKana by remember { mutableStateOf<Kana?>(null) }

    Box(Modifier.fillMaxSize().background(AppColors.background)) {
        KanaGrid(
            provider = provider,
            showConsonants = store.showVowelsAndConsonants,
            onPressKana = store::type,
            onLongPressKana = { longPressKana = it },
        )
        longPressKana?.let { kana ->
            KanaFormsOverlay(
                forms = provider.allForms(kana),
                showConsonants = store.showVowelsAndConsonants,
                onPressKana = {
                    store.type(it)
                    longPressKana = null
                },
                onRequestHide = { longPressKana = null },
            )
        }
        if (store.typingKana.isNotEmpty()) {
            TypingBar(
                kanaType = store.kanaType,
                onBackspace = store::backspace,
                onMark = store::typeMark,
                onSpace = store::typeSpace,
                onSave = store::saveTypedWord,
                modifier = Modifier.align(Alignment.BottomCenter),
            )
        }
        TopBar(store = store, onShowWordList = onShowWordList)
    }
}

// region kana grid

@Composable
private fun KanaGrid(
    provider: KanaProvider,
    showConsonants: Boolean,
    onPressKana: (Kana) -> Unit,
    onLongPressKana: (Kana) -> Unit,
) {
    val top = WindowInsets.statusBars.asPaddingValues().calculateTopPadding()
    val bottom = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding()
    val baseColor = LocalButtonColor.current
    val viewConfiguration = LocalViewConfiguration.current
    // The Expo app opened the forms overlay after a 200 ms hold.
    val shortLongPress = remember(viewConfiguration) {
        object : ViewConfiguration by viewConfiguration {
            override val longPressTimeoutMillis = 200L
        }
    }

    CompositionLocalProvider(LocalViewConfiguration provides shortLongPress) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            Spacer(Modifier.height(top + Sizes.expandedTopBar))
            provider.monographs.forEachIndexed { index, row ->
                val consonant = provider.tableRows[index]
                KanaRow(
                    items = row,
                    consonant = consonant,
                    alternateConsonants = provider.diacriticConsonants(consonant),
                    showConsonant = showConsonants,
                    color = baseColor.darken(0.02f * index),
                    onPressKana = onPressKana,
                    onLongPressKana = onLongPressKana,
                )
            }
            Spacer(Modifier.height(240.dp + bottom))
        }
    }
}

@Composable
private fun KanaRow(
    items: List<Kana?>,
    consonant: String,
    alternateConsonants: List<String>,
    showConsonant: Boolean,
    color: Color,
    onPressKana: (Kana) -> Unit,
    onLongPressKana: (Kana) -> Unit,
) {
    Row(Modifier.fillMaxWidth()) {
        Text(
            text = if (!showConsonant || consonant.startsWith("~")) " " else consonant,
            fontSize = 16.sp,
            textAlign = TextAlign.Center,
            color = AppColors.secondaryText,
            modifier = Modifier.width(Sizes.verticalKey).align(Alignment.CenterVertically),
        )
        Row(
            Modifier.weight(1f).padding(vertical = Sizes.small),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            items.forEach { item ->
                if (item == null) {
                    Spacer(Modifier.width(Sizes.kanaButtonDiameter))
                } else {
                    KanaButtonWithNHint(
                        kana = item,
                        color = color,
                        showConsonant = showConsonant,
                        onPress = { onPressKana(item) },
                        onLongPress = { onLongPressKana(item) },
                    )
                }
            }
        }
        if (alternateConsonants.isEmpty()) {
            Spacer(Modifier.width(Sizes.verticalKey))
        } else {
            DakutenIndicator(
                alternateConsonants,
                showConsonant,
                Modifier.align(Alignment.CenterVertically),
            )
        }
    }
}

/** ン has no row of its own, so it gets an "(n)" hint under it. */
@Composable
private fun KanaButtonWithNHint(
    kana: Kana,
    color: Color,
    showConsonant: Boolean,
    onPress: () -> Unit,
    onLongPress: () -> Unit,
) {
    val button = @Composable { KanaButton(kana.kana, color, onPress, onLongPress) }
    if ((kana.kana == "ン" || kana.kana == "ん") && showConsonant) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            button()
            Text(
                "(n)",
                fontSize = 16.sp,
                color = AppColors.secondaryText,
                modifier = Modifier.padding(top = Sizes.small),
            )
        }
    } else {
        button()
    }
}

@Composable
fun KanaButton(
    text: String,
    color: Color,
    onPress: () -> Unit,
    onLongPress: (() -> Unit)? = null,
) {
    KanaButtonShell(color, onPress, onLongPress) {
        Text(
            text,
            style = TextStyles.kana,
            fontSize = if (text.length > 1) 22.sp else 30.sp,
        )
    }
}

@Composable
private fun KanaButtonShell(
    color: Color,
    onPress: () -> Unit,
    onLongPress: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    Box(
        Modifier
            .size(Sizes.kanaButtonDiameter)
            .pressable(onLongClick = onLongPress, onClick = onPress)
            .background(color, CircleShape),
        contentAlignment = Alignment.Center,
    ) { content() }
}

/** Shows that a row has dakuten (゛) / handakuten (゜) forms, or their consonants. */
@Composable
private fun DakutenIndicator(consonants: List<String>, showConsonant: Boolean, modifier: Modifier) {
    Column(
        modifier.width(Sizes.verticalKey).height(Sizes.kanaButtonDiameter),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        consonants.forEachIndexed { index, symbol ->
            Text(
                text = if (showConsonant) symbol else when (index) {
                    0 -> "゛"
                    1 -> "゜"
                    else -> ""
                },
                fontSize = if (showConsonant) 10.sp else 20.sp,
                lineHeight = if (showConsonant) 12.sp else 20.sp,
                color = AppColors.secondaryText,
                textAlign = TextAlign.Center,
                modifier = if (showConsonant) Modifier else Modifier.padding(start = 5.dp),
            )
        }
    }
}

// endregion

// region forms overlay

@Composable
private fun KanaFormsOverlay(
    forms: List<Kana>,
    showConsonants: Boolean,
    onPressKana: (Kana) -> Unit,
    onRequestHide: () -> Unit,
) {
    val baseColor = LocalButtonColor.current
    val screenWidth = LocalConfiguration.current.screenWidthDp.dp
    val spaceBetween = (screenWidth / 6 - Sizes.kanaButtonDiameter).coerceAtLeast(0.dp)
    val groups = forms.groupBy { it.consonant }

    Box(
        Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onRequestHide,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Box(Modifier.fillMaxSize().background(AppColors.background.copy(alpha = 0.9f)))
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Column(
                Modifier
                    .widthIn(min = 150.dp)
                    .background(AppColors.overlaySolid, RoundedCornerShape(Sizes.borderRadius)),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                groups.values.forEach { group ->
                    Row(
                        Modifier.padding(vertical = Sizes.small),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        group.forEachIndexed { index, kana ->
                            Column(
                                Modifier.padding(horizontal = spaceBetween / 2),
                                horizontalAlignment = Alignment.CenterHorizontally,
                            ) {
                                if (showConsonants) {
                                    Text(
                                        kana.romaji,
                                        fontSize = 16.sp,
                                        color = AppColors.buttonText,
                                        modifier = Modifier.padding(bottom = Sizes.small),
                                    )
                                }
                                KanaButton(
                                    kana.kana,
                                    if (index == 0) baseColor else baseColor.darken(0.1f),
                                    onPress = { onPressKana(kana) },
                                )
                            }
                        }
                    }
                }
            }
            Spacer(Modifier.height(Sizes.small))
            KanaButtonShell(AppColors.destructive, onRequestHide) {
                Icon(Icons.Filled.Close, "Close", tint = AppColors.buttonText, modifier = Modifier.size(30.dp))
            }
        }
    }
}

// endregion

// region typing bar

@Composable
private fun TypingBar(
    kanaType: KanaType,
    onBackspace: () -> Unit,
    onMark: (String) -> Unit,
    onSpace: () -> Unit,
    onSave: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Box(modifier.fillMaxWidth().background(AppColors.overlay)) {
        Row(
            Modifier
                .navigationBarsPadding()
                .padding(horizontal = Sizes.large)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            KeyboardKey(onPress = onBackspace) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, "Delete last kana", tint = Color.White, modifier = Modifier.size(30.dp))
            }
            Row {
                val sokuon = if (kanaType == KanaType.Katakana) "ッ" else "っ"
                KeyboardKey(onPress = { onMark(sokuon) }) { KeyText(sokuon) }
                Spacer(Modifier.width(Sizes.medium))
                KeyboardKey(onPress = { onMark("ー") }) { KeyText("ー") }
                Spacer(Modifier.width(Sizes.medium))
                KeyboardKey(onPress = onSpace, width = 75.dp) {}
            }
            KeyboardKey(onPress = onSave) {
                Icon(Icons.Filled.Add, "Save word", tint = Color.White, modifier = Modifier.size(30.dp))
            }
        }
    }
}

@Composable
private fun KeyText(text: String) = Text(text, fontSize = 30.sp, color = Color.White)

@Composable
private fun KeyboardKey(onPress: () -> Unit, width: Dp? = null, content: @Composable () -> Unit) {
    Box(
        Modifier
            .padding(vertical = Sizes.medium)
            .pressable(onClick = onPress)
            .height(44.dp)
            .then(if (width != null) Modifier.width(width) else Modifier.widthIn(min = 44.dp))
            .border(1.dp, Color.White, RoundedCornerShape(Sizes.borderRadius))
            .padding(horizontal = Sizes.small),
        contentAlignment = Alignment.Center,
    ) { content() }
}

// endregion

// region top bar

@Composable
private fun TopBar(store: AppStore, onShowWordList: () -> Unit) {
    val top = WindowInsets.statusBars.asPaddingValues().calculateTopPadding()
    val typing = store.typingKana.isNotEmpty()
    Box(
        Modifier
            .fillMaxWidth()
            .height(Sizes.expandedTopBar + top)
            .background(if (typing) AppColors.overlay else AppColors.background.copy(alpha = 0x99 / 255f)),
    ) {
        Column(Modifier.padding(top = top)) {
            if (typing) {
                TypedWord(store.typingKana)
            } else {
                Toolbar(store, onShowWordList)
            }
        }
        if (store.showVowelsAndConsonants) {
            Row(
                Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(horizontal = Sizes.verticalKey),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                listOf("a", "i", "u", "e", "o").forEach {
                    Text(
                        it,
                        fontSize = 16.sp,
                        textAlign = TextAlign.Center,
                        color = AppColors.secondaryText,
                        modifier = Modifier.width(Sizes.kanaButtonDiameter).padding(bottom = Sizes.small),
                    )
                }
            }
        }
    }
}

@Composable
private fun Toolbar(store: AppStore, onShowWordList: () -> Unit) {
    val buttonColor = LocalButtonColor.current
    Row(
        Modifier
            .fillMaxWidth()
            .height(Sizes.topBar)
            .padding(horizontal = Sizes.large),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            "aiueo",
            fontSize = 26.sp,
            fontStyle = FontStyle.Italic,
            color = if (store.showVowelsAndConsonants) buttonColor else AppColors.secondaryText,
            modifier = Modifier.pressable(onClick = store::toggleVowelsAndConsonants),
        )
        Box(
            Modifier
                .padding(start = Sizes.medium)
                .size(32.dp)
                .pressable(onClick = store::cycleColor)
                .background(buttonColor, CircleShape)
                .border(2.dp, AppColors.buttonText, CircleShape),
        )
        Spacer(Modifier.width(Sizes.medium))
        KanaTypeSwitcher(store.kanaType, store::toggleKanaType)
        Spacer(Modifier.weight(1f))
        Box {
            Box(
                Modifier
                    .testTag("show-word-list-button")
                    .pressable(onClick = onShowWordList)
                    .border(2.dp, AppColors.buttonText, RoundedCornerShape(Sizes.borderRadius))
                    .padding(vertical = 5.dp, horizontal = 10.dp),
            ) {
                Text("カナ", style = TextStyles.smallDark)
            }
            val count = store.savedWords.size
            if (count > 0) {
                Box(
                    Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 10.dp, y = (-10).dp)
                        .height(26.dp)
                        .widthIn(min = 26.dp)
                        .background(buttonColor, RoundedCornerShape(13.dp))
                        .padding(horizontal = 3.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(count.toString(), fontSize = 18.sp, fontWeight = FontWeight.Bold, color = AppColors.buttonText)
                }
            }
        }
    }
}

@Composable
private fun KanaTypeSwitcher(kanaType: KanaType, onPress: () -> Unit) {
    val selected = LocalButtonColor.current
    Column(
        Modifier.pressable(onClick = onPress),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            "カタカナ",
            fontSize = 10.sp,
            color = if (kanaType == KanaType.Katakana) selected else AppColors.secondaryText,
        )
        Box(
            Modifier
                .padding(vertical = 3.dp)
                .width(26.dp)
                .height(1.dp)
                .background(AppColors.secondaryText),
        )
        Text(
            "ひらがな",
            fontSize = 10.sp,
            color = if (kanaType == KanaType.Hiragana) selected else AppColors.secondaryText,
        )
    }
}

@Composable
private fun TypedWord(typingKana: List<Kana>) {
    val scrollState = rememberScrollState()
    LaunchedEffect(typingKana.size) {
        delay(100)
        scrollState.scrollTo(scrollState.maxValue)
    }
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .horizontalScroll(scrollState)
                .widthIn(min = maxWidth)
                .padding(horizontal = Sizes.medium),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            typingKana.forEach { ReadingKana(it) }
            BlinkingCursor(Modifier.align(Alignment.Bottom))
        }
    }
}

@Composable
private fun BlinkingCursor(modifier: Modifier) {
    val transition = rememberInfiniteTransition(label = "cursor")
    val alpha by transition.animateFloat(
        initialValue = 1f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(500), RepeatMode.Reverse),
        label = "cursorAlpha",
    )
    Box(
        modifier
            .padding(horizontal = 2.dp)
            .width(26.dp)
            .height(2.dp)
            .alpha(alpha)
            .background(AppColors.buttonText),
    )
}

// endregion
