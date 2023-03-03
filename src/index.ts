import { commands, ExtensionContext, languages, workspace } from 'coc.nvim';
import { customDataSetupCommand } from './commands';
import { SelectorCompletionItemProvider } from './completion';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('html-css-support');

  const isEnable = config.get<boolean>('enable', true);
  if (!isEnable) {
    return;
  }

  const enabledLanguages = config.get<string[]>('enabledLanguages', ['html']);
  const provider = new SelectorCompletionItemProvider();
  context.subscriptions.push(
    commands.registerCommand('html-css-support.dispose', () => provider.dispose()),
    languages.registerCompletionItemProvider('html-css-support', 'HCS', enabledLanguages, provider),
    provider
  );

  /** MEMO: Custom commands for coc-html-css-support */
  context.subscriptions.push(
    commands.registerCommand('html-css-support.customDataSetup', customDataSetupCommand(context))
  );
}

export function deactivate() {}
