'use strict';

import * as vscode from 'vscode';
import GoogleFontFamily from './font';
import GoogleApi from './google.api';

// Holds the pick options for the user :
const pickOptions: vscode.QuickPickOptions = {
  matchOnDescription: true,
  placeHolder: 'Type Google Font name'
};

/**
 * Allows to insert any text inside the editor
 * @param text The text you want to insert in the editor at the position where the cursor is
 */
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

/**
 * Manage the possibility to insert a <link href=".." /> inside the editor
 */
async function insertFontLink() {
  const font = await getGoogleFontFamilyItem();
  if (!font) {
    return;
  }
  // Creating the <link> markup
  const snippet = `<link href="${GoogleApi.generateUrl(
    font
  )}&display=swap" rel="stylesheet" />`;

  // Inserting the link markup inside the editor
  await insertText(snippet);
}

/**
 * Manages the possibility to insert a @import url(..) inside the editor
 */
async function insertFontCssImport() {
  // Holds the details of the font (name, subsets, variants, etc)
  const font = await getGoogleFontFamilyItem();
  if (!font) {
    return;
  }

  // Creating the @import url(...) snippet
  const snippet = `@import url(${GoogleApi.generateUrl(font)}&display=swap);`;

  // Inserting the @import inside the editor
  await insertText(snippet);
}

async function getGoogleFontFamilyItem(): Promise<GoogleFontFamily | undefined> {
  const fontsOptions = await GoogleApi.getGoogleFonts();

  // Let the user choose and return this choice !
  const family = await vscode.window.showQuickPick(
    fontsOptions.map((item: GoogleFontFamily) => item.family),
    pickOptions
  );

  if (!family) {
    return undefined;
  }

  // Holds the details of the font (name, subsets, variants, etc)
  return fontsOptions.find(
    (item: GoogleFontFamily) => item.family === family
  );
}

export function activate(context: vscode.ExtensionContext) {
  // The insertLink Command to insert a <link href="..">
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

  // The insertImport Command to insert a @import url(...)
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

  // Adding our commands to the context
  context.subscriptions.push(insertLink);
  context.subscriptions.push(insertImport);
}

export function deactivate() {}


