/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import { commands, ExtensionContext, languages, TextDocument, window, workspace } from 'coc.nvim';
import { customDataSetupCommand } from './commands';
import { AutoValidation, getAutoValidation, getEnabledLanguages } from './settings';
import { Provider, clear, invalidate } from './provider';

const enabledLanguages = getEnabledLanguages();
const validations = languages.createDiagnosticCollection();
const provider = new Provider();

async function validate(document: TextDocument, type: AutoValidation | undefined) {
  if (enabledLanguages.includes(document.languageId)) {
    const validation = getAutoValidation(document);
    if (!type || type === validation) {
      validations.set(document.uri, await provider.validate(document));
    } else if (validation !== AutoValidation.ALWAYS) {
      validations.delete(document.uri);
    }
  }
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCompletionItemProvider('html-css-support', 'HCS', enabledLanguages, provider),
    languages.registerDefinitionProvider(enabledLanguages, provider),
    workspace.onDidSaveTextDocument(async (document) => {
      invalidate(document.uri.toString());
      await validate(document, AutoValidation.SAVE);
    }),
    workspace.onDidOpenTextDocument(async (document) => {
      await validate(document, AutoValidation.ALWAYS);
    }),
    workspace.onDidChangeTextDocument(async (event) => {
      if (event.contentChanges.length > 0) {
        await validate(workspace.getDocument(event.bufnr).textDocument, AutoValidation.ALWAYS);
      }
    }),
    workspace.onDidCloseTextDocument((document) => {
      validations.delete(document.uri);
    }),
    commands.registerCommand('html-css-support.validate', async (type: AutoValidation | undefined) => {
      const editor = window.activeTextEditor;
      if (editor) {
        await validate(editor.document.textDocument, type);
      }
    }),
    commands.registerCommand('html-css-support.clear', () => clear()),
  );

  /** MEMO: Custom commands for coc-html-css-support */
  context.subscriptions.push(
    commands.registerCommand('html-css-support.customDataSetup', customDataSetupCommand(context)),
  );
  return commands.executeCommand<void>('html-css-support.validate', AutoValidation.ALWAYS);
}

export function deactivate() {}
