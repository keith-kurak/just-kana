package com.keithkurak.justkana.ui

import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.speech.tts.TextToSpeech
import androidx.activity.compose.BackHandler
import androidx.browser.customtabs.CustomTabsIntent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.ContentCopy
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import com.keithkurak.justkana.data.AppStore
import com.keithkurak.justkana.data.Kana
import com.keithkurak.justkana.data.SavedWord
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle
import java.util.Locale

/** A row in the word list. [saved] is set only for the user's own words. */
private data class WordItem(val word: List<Kana>, val translation: String?, val saved: SavedWord?)

private data class Section(val title: String, val items: List<WordItem>)

@Composable
fun WordsScreen(store: AppStore, onBack: () -> Unit, onShowSettings: () -> Unit) {
    var filterIndex by rememberSaveable { mutableStateOf(0) }
    var selected by remember { mutableStateOf<WordItem?>(null) }
    val context = LocalContext.current
    val tts = rememberTextToSpeech()

    val sections = if (filterIndex == 0) savedWordSections(store.savedWords)
    else store.kanaRepository.commonWords.map { group ->
        Section(group.title, group.words.map { WordItem(it.word, it.translation, null) })
    }

    BackHandler(enabled = selected != null) { selected = null }

    Box(Modifier.fillMaxSize().background(AppColors.background)) {
        MinimalNavbarScaffold(
            onBack = onBack,
            center = {
                SegmentedControl(listOf("Mine", "Common"), filterIndex) { filterIndex = it }
            },
            right = {
                Icon(
                    Icons.Outlined.Settings,
                    contentDescription = "Settings",
                    tint = AppColors.buttonText,
                    modifier = Modifier.size(30.dp).pressable(onClick = onShowSettings),
                )
            },
        ) {
            WordList(sections) { selected = it }
        }

        selected?.let { item ->
            WordDetailPanel(
                word = item.word,
                canDelete = item.saved != null,
                onDismiss = { selected = null },
                onSpeak = {
                    tts.value?.speak(item.word.joinToString("") { it.romaji }, TextToSpeech.QUEUE_FLUSH, null, "word")
                },
                onTranslate = { openTranslation(context, item.word) },
                onCopy = {
                    val text = item.word.joinToString("") { it.kana } +
                        " (" + item.word.joinToString("") { it.romaji } + ")"
                    copyToClipboard(context, text)
                    selected = null
                },
                onDelete = {
                    item.saved?.let(store::deleteWord)
                    selected = null
                },
            )
        }
    }
}

private fun savedWordSections(words: List<SavedWord>): List<Section> {
    val zone = ZoneId.systemDefault()
    val formatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM)
    return words
        .sortedByDescending { it.date }
        .groupBy { runCatching { OffsetDateTime.parse(it.date).atZoneSameInstant(zone).toLocalDate() }.getOrNull() }
        .map { (day, list) ->
            Section(day?.format(formatter) ?: "", list.map { WordItem(it.word, null, it) })
        }
}

@Composable
private fun WordList(sections: List<Section>, onPressWord: (WordItem) -> Unit) {
    if (sections.isEmpty()) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Go back and add your first word!", style = TextStyles.smallDark)
        }
        return
    }
    val bottom = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding()
    LazyColumn(Modifier.fillMaxSize()) {
        sections.forEach { section(it, onPressWord) }
        item { Spacer(Modifier.height(bottom)) }
    }
}

private fun LazyListScope.section(section: Section, onPressWord: (WordItem) -> Unit) {
    item {
        Text(section.title, style = TextStyles.smallLight, modifier = Modifier.padding(start = Sizes.medium))
    }
    itemsIndexed(section.items) { index, item ->
        if (index > 0) {
            HorizontalDivider(
                modifier = Modifier.padding(horizontal = Sizes.medium),
                thickness = 0.5.dp,
                color = AppColors.secondaryText,
            )
        }
        Row(
            Modifier
                .fillMaxWidth()
                .clickable { onPressWord(item) }
                .padding(Sizes.medium),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f).padding(end = Sizes.medium)) {
                ReadingWord(item.word)
                item.translation?.let {
                    Text(
                        "\"$it\"",
                        style = TextStyles.smallLight,
                        fontStyle = FontStyle.Italic,
                        modifier = Modifier.padding(top = Sizes.small).align(Alignment.CenterHorizontally),
                    )
                }
            }
            Icon(Icons.Filled.MoreHoriz, "More", tint = AppColors.secondaryText, modifier = Modifier.size(24.dp))
        }
    }
    item { Spacer(Modifier.height(20.dp)) }
}

@Composable
private fun WordDetailPanel(
    word: List<Kana>,
    canDelete: Boolean,
    onDismiss: () -> Unit,
    onSpeak: () -> Unit,
    onTranslate: () -> Unit,
    onCopy: () -> Unit,
    onDelete: () -> Unit,
) {
    Box(
        Modifier
            .fillMaxSize()
            .background(AppColors.background.copy(alpha = 0.7f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onDismiss,
            ),
    ) {
        Column(
            Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(AppColors.overlay)
                // Swallow taps so they don't reach the backdrop.
                .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null) {}
                .navigationBarsPadding()
                .padding(Sizes.medium),
        ) {
            Row(
                Modifier.fillMaxWidth().padding(bottom = Sizes.medium),
                horizontalArrangement = Arrangement.Center,
            ) {
                ToolbarButton(Icons.Outlined.ChatBubbleOutline, "Speak", onSpeak)
                ToolbarButton(Icons.Filled.Translate, "Translate", onTranslate)
                ToolbarButton(Icons.Outlined.ContentCopy, "Copy", onCopy)
                if (canDelete) {
                    ToolbarButton(Icons.Outlined.Delete, "Delete", onDelete, AppColors.destructive)
                }
            }
            ReadingWord(word, Modifier.fillMaxWidth(), centered = true)
        }
    }
}

@Composable
private fun ToolbarButton(icon: ImageVector, label: String, onPress: () -> Unit, color: Color = Color.White) {
    Box(
        Modifier
            .padding(horizontal = Sizes.medium)
            .pressable(onClick = onPress)
            .width(60.dp)
            .height(50.dp)
            .border(1.dp, color, RoundedCornerShape(Sizes.borderRadius)),
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, label, tint = color, modifier = Modifier.size(30.dp))
    }
}

@Composable
private fun rememberTextToSpeech(): androidx.compose.runtime.MutableState<TextToSpeech?> {
    val context = LocalContext.current
    val holder = remember { mutableStateOf<TextToSpeech?>(null) }
    DisposableEffect(context) {
        var engine: TextToSpeech? = null
        engine = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                engine?.language = Locale.JAPANESE
                holder.value = engine
            }
        }
        onDispose {
            engine?.shutdown()
            holder.value = null
        }
    }
    return holder
}

private fun openTranslation(context: Context, word: List<Kana>) {
    val text = word.joinToString("") { it.kana }
    val uri = Uri.parse("https://translate.google.com/?sl=ja&tl=en&op=translate&text=" + Uri.encode(text))
    try {
        CustomTabsIntent.Builder().build().launchUrl(context, uri)
    } catch (_: ActivityNotFoundException) {
        try {
            context.startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: ActivityNotFoundException) {
        }
    }
}

fun copyToClipboard(context: Context, text: String) {
    val clipboard = context.getSystemService(ClipboardManager::class.java)
    clipboard.setPrimaryClip(ClipData.newPlainText("Some Kana", text))
}
