'use strict';

import * as vscode from 'vscode';
import GoogleFontFamily from './font';
import GoogleApi from './google.api';

const pickOptions: vscode.QuickPickOptions = {
  matchOnDescription: true,
  placeHolder: 'Type Google Font name'
};

async function insertText(text: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  await editor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.delete(editor.selection);
    editBuilder.insert(editor.selection.start, text);
  });
}

async function insertFontLink() {
  const font = await getGoogleFontFamilyItem();
  if (!font) {
    return;
  }
  const snippet = `<link href="${GoogleApi.generateUrl(
    font
  )}&display=swap" rel="stylesheet" />`;

  await insertText(snippet);
}

async function insertFontCssImport() {
  const font = await getGoogleFontFamilyItem();
  if (!font) {
    return;
  }

  const snippet = `@import url(${GoogleApi.generateUrl(font)}&display=swap);`;

  await insertText(snippet);
}

async function getGoogleFontFamilyItem(): Promise<GoogleFontFamily | undefined> {
  const fontsOptions = await GoogleApi.getGoogleFonts();

  const family = await vscode.window.showQuickPick(
    fontsOptions.map((item: GoogleFontFamily) => item.family),
    pickOptions
  );

  if (!family) {
    return undefined;
  }

  return fontsOptions.find(
    (item: GoogleFontFamily) => item.family === family
  );
}

export function activate(context: vscode.ExtensionContext) {
  const insertLink = vscode.commands.registerCommand(
    'google-fonts.insertLink',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(
          "You can't use this extension if you don't have an active editor!"
        );
        return;
      }

      await insertFontLink();
    }
  );

  const insertImport = vscode.commands.registerCommand(
    'google-fonts.insertImport',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(
          "You can't use this extension if you don't have an active editor!"
        );
        return;
      }

      await insertFontCssImport();
    }
  );

  context.subscriptions.push(insertLink);
  context.subscriptions.push(insertImport);
}

export function deactivate() {}


