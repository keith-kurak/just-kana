package com.keithkurak.justkana.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.keithkurak.justkana.data.Kana

/** Click handling with the "fade to 50% while pressed" feedback the Expo app used. */
@Composable
fun Modifier.pressable(onLongClick: (() -> Unit)? = null, onClick: () -> Unit): Modifier {
    val source = remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    return this
        .alpha(if (pressed) 0.5f else 1f)
        .combinedClickable(
            interactionSource = source,
            indication = null,
            onLongClick = onLongClick,
            onClick = onClick,
        )
}

object TextStyles {
    val kana = TextStyle(color = AppColors.buttonText, fontSize = 30.sp)
    val smallDark = TextStyle(color = AppColors.buttonText, fontSize = 18.sp)
    val smallLight = TextStyle(color = AppColors.secondaryText, fontSize = 18.sp)
    val mediumDark = TextStyle(color = AppColors.buttonText, fontSize = 26.sp)
}

/** A kana with its romaji under it. A space is shown as a gap. */
@Composable
fun ReadingKana(kana: Kana, color: Color = AppColors.buttonText) {
    if (kana.kana == " ") {
        Spacer(Modifier.width(30.dp))
        return
    }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(kana.kana, style = TextStyles.kana.copy(color = color))
        Text(kana.romaji, style = TextStyles.smallDark.copy(color = color))
    }
}

/** Kana of a word in a wrapping row. */
@Composable
fun ReadingWord(word: List<Kana>, modifier: Modifier = Modifier, centered: Boolean = false) {
    FlowRow(
        modifier = modifier,
        horizontalArrangement = if (centered) Arrangement.Center else Arrangement.Start,
    ) {
        word.forEach { ReadingKana(it) }
    }
}

/** The simple header used on secondary screens: back arrow, optional center and right items. */
@Composable
fun MinimalNavbarScaffold(
    onBack: () -> Unit,
    center: (@Composable () -> Unit)? = null,
    right: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    Column(Modifier.fillMaxSize().statusBarsPadding()) {
        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .padding(horizontal = 8.dp),
        ) {
            Icon(
                Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Back",
                tint = AppColors.buttonText,
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .width(40.dp)
                    .height(40.dp)
                    .pressable(onClick = onBack),
            )
            if (center != null) Box(Modifier.align(Alignment.Center)) { center() }
            if (right != null) Box(Modifier.align(Alignment.CenterEnd)) { right() }
        }
        content()
    }
}

@Composable
fun SegmentedControl(options: List<String>, selectedIndex: Int, onChange: (Int) -> Unit) {
    val shape = RoundedCornerShape(Sizes.borderRadius)
    Row(
        Modifier
            .clip(shape)
            .border(1.dp, AppColors.buttonText, shape),
    ) {
        options.forEachIndexed { index, option ->
            val selected = index == selectedIndex
            Box(
                Modifier
                    .background(if (selected) AppColors.buttonText else AppColors.background)
                    .pressable { onChange(index) }
                    .padding(Sizes.small),
            ) {
                Text(
                    option,
                    fontSize = 12.sp,
                    color = if (selected) AppColors.background else AppColors.buttonText,
                )
            }
        }
    }
}
