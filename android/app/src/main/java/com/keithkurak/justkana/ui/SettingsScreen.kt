package com.keithkurak.justkana.ui

import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import com.keithkurak.justkana.BuildConfig
import com.keithkurak.justkana.data.AppStore
import java.io.File

@Composable
fun SettingsScreen(store: AppStore, onBack: () -> Unit) {
    val context = LocalContext.current
    // 0 = no dialog, 1 = first confirmation, 2 = second confirmation
    var deleteStep by remember { mutableIntStateOf(0) }

    Box(Modifier.fillMaxSize().background(AppColors.background)) {
        MinimalNavbarScaffold(onBack = onBack) {
            Column(
                Modifier.fillMaxSize().navigationBarsPadding(),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Column(
                    Modifier.weight(1f).fillMaxWidth(),
                    verticalArrangement = Arrangement.SpaceAround,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    SettingsSection(
                        title = "Export words",
                        subtitle = "Save your learned words for posterity.",
                    ) {
                        SettingsButton("Copy all to clipboard", LocalButtonColor.current) {
                            copyToClipboard(context, store.wordsAsText())
                            toast(context, "Copied!")
                        }
                        SettingsButton("Export all to text file", LocalButtonColor.current) {
                            shareAsFile(context, store.wordsAsText())
                        }
                    }
                    SettingsSection(
                        title = "Delete all words",
                        subtitle = "Restart with a blank slate.",
                        warning = "This cannot be undone!",
                    ) {
                        SettingsButton("Delete everything", AppColors.destructive) { deleteStep = 1 }
                    }
                }
                VersionInfo(context)
            }
        }
    }

    when (deleteStep) {
        1 -> ConfirmDialog(
            title = "Really delete all words?",
            message = "This cannot be undone",
            confirm = "Yes, Delete",
            onConfirm = { deleteStep = 2 },
            onDismiss = { deleteStep = 0 },
        )
        2 -> ConfirmDialog(
            title = "Are you sure?",
            message = null,
            confirm = "Yes, Delete!!",
            onConfirm = {
                deleteStep = 0
                store.deleteAllWords()
                toast(context, "All words deleted!")
            },
            onDismiss = { deleteStep = 0 },
        )
    }
}

@Composable
private fun SettingsSection(
    title: String,
    subtitle: String,
    warning: String? = null,
    content: @Composable () -> Unit,
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(Sizes.small),
    ) {
        Text(title, style = TextStyles.mediumDark)
        Text(subtitle, style = TextStyles.smallLight, textAlign = TextAlign.Center)
        if (warning != null) Text(warning, style = TextStyles.smallDark, color = AppColors.destructive)
        content()
    }
}

@Composable
private fun SettingsButton(text: String, color: Color, onPress: () -> Unit) {
    Box(
        Modifier
            .padding(top = Sizes.small)
            .pressable(onClick = onPress)
            .background(color, RoundedCornerShape(Sizes.borderRadius))
            .padding(Sizes.medium),
    ) {
        Text(text, style = TextStyles.smallDark)
    }
}

@Composable
private fun VersionInfo(context: Context) {
    val version = BuildConfig.VERSION_NAME
    val build = BuildConfig.VERSION_CODE.toString()
    Column(
        Modifier
            .padding(bottom = Sizes.medium)
            .combinedClickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onLongClick = {
                    copyToClipboard(context, "v. $version b. $build")
                    toast(context, "Version info copied!")
                },
                onClick = {},
            ),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("Version info", style = TextStyles.smallDark)
        Text(version, style = TextStyles.smallLight, fontSize = 14.sp)
        Text(build, style = TextStyles.smallLight, fontSize = 14.sp)
    }
}

@Composable
private fun ConfirmDialog(
    title: String,
    message: String?,
    confirm: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = if (message != null) { { Text(message) } } else null,
        confirmButton = {
            TextButton(onClick = onConfirm) { Text(confirm, color = AppColors.destructive) }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("No") }
        },
    )
}

private fun toast(context: Context, text: String) =
    Toast.makeText(context, text, Toast.LENGTH_SHORT).show()

private fun shareAsFile(context: Context, text: String) {
    val dir = File(context.cacheDir, "exports").apply { mkdirs() }
    val file = File(dir, "kanaexport.txt").apply { writeText(text) }
    val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
    val send = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_STREAM, uri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
    }
    context.startActivity(Intent.createChooser(send, null))
}
