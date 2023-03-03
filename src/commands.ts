import { extensions, ExtensionContext, window, workspace } from 'coc.nvim';
import path from 'path';

export function customDataSetupCommand(context: ExtensionContext) {
  return async () => {
    if (!extensions.all.find((e) => e.id === 'coc-html')) {
      window.showWarningMessage(`coc-html is not installed`);
      return;
    }

    const htmlConfig = workspace.getConfiguration('html');
    const picked = await window.showMenuPicker(['Alpine.js', 'petite-vue'], 'Which customData do you want to use?');

    switch (picked) {
      case -1:
        // Cancel!
        window.showInformationMessage(`It's been cancelled`);
        break;
      case 0:
        // Alpine.js
        htmlConfig.update('customData', [path.join(context.extensionPath, 'customData', 'alpinejs', 'html.json')]);
        break;
      case 1:
        // petite-vue
        htmlConfig.update('customData', [path.join(context.extensionPath, 'customData', 'petite-vue', 'html.json')]);
        break;
      default:
        // Cancel!
        window.showInformationMessage(`It's been cancelled`);
        break;
    }

    if (picked !== -1) {
      workspace.nvim.command(`CocRestart`, true);
    }
  };
}
