import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Diagnostic,
  DiagnosticSeverity,
  Disposable,
  Position,
  ProviderResult,
  Range,
  TextDocument,
  Uri,
  workspace,
} from 'coc.nvim';
import { parse, walk } from 'css-tree';
import fetch from 'node-fetch';
import { basename, dirname, extname, isAbsolute, join } from 'path';

export type Context = {
  ids: Map<string, CompletionItem>;
  classes: Map<string, CompletionItem>;
};

export class SelectorCompletionItemProvider implements CompletionItemProvider, Disposable {
  readonly start = Position.create(0, 0);
  readonly cache = new Map<string, CompletionItem[]>();
  readonly files = new Map<string, string>();
  readonly watchers = new Map<string, Disposable>();
  readonly isRemote = /^https?:\/\//i;
  readonly canComplete = /(id|class|className)\s*[=:]\s*("|')(?:(?!\2).)*$/is;
  readonly findLinkRel = /rel\s*=\s*("|')((?:(?!\1).)+)\1/is;
  readonly findLinkHref = /href\s*=\s*("|')((?:(?!\1).)+)\1/is;
  readonly findExtended = /(?:{{<|{{>|{%\s*extends|@extends\s*\()\s*("|')?([./A-Za-z_0-9\\\-]+)\1\s*(?:\)|%}|}})/i;

  dispose() {
    this.watchers.forEach((e) => e.dispose());
    this.watchers.clear();
    this.cache.clear();
    this.files.clear();
  }

  watchFile(path: string, listener: () => any) {
    if (this.watchers.has(path)) {
      return;
    }

    const watcher = workspace.createFileSystemWatcher(path);

    watcher.onDidCreate(listener);
    watcher.onDidChange(listener);
    watcher.onDidDelete(listener);

    this.watchers.set(path, watcher);
  }

  getStyleSheets(uri: Uri): string[] {
    return workspace.getConfiguration('html-css-support', uri.toString()).get<string[]>('styleSheets', []);
  }

  getPath(uri: Uri, path: string, ext?: string): string {
    const folder = workspace.getWorkspaceFolder(uri.toString());
    const name = ext ? join(dirname(path), basename(path, ext) + ext) : path;

    return folder ? join(isAbsolute(path) ? folder.uri : dirname(uri.fsPath), name) : join(dirname(uri.fsPath), name);
  }

  parseTextToItems(path: string, text: string, items: CompletionItem[]) {
    walk(parse(text), (node) => {
      let kind: CompletionItemKind;

      switch (node.type) {
        case 'ClassSelector':
          kind = CompletionItemKind.Enum;
          break;
        case 'IdSelector':
          kind = CompletionItemKind.Value;
          break;
        default:
          return;
      }

      const resultCompletionItem: CompletionItem = {
        label: node.name,
        kind,
        detail: 'filename: ' + path,
      };

      items.push(resultCompletionItem);
    });
  }

  async fetchLocal(path: string): Promise<void> {
    if (this.cache.has(path)) {
      return;
    }

    const items: CompletionItem[] = [];

    try {
      const content = await workspace.readFile(path);
      this.parseTextToItems(basename(path), content.toString(), items);
    } catch (error) {}

    this.cache.set(path, items);
    this.watchFile(path, () => this.cache.delete(path));
  }

  async fetchRemote(path: string): Promise<void> {
    if (this.cache.has(path)) {
      return;
    }

    const items: CompletionItem[] = [];

    try {
      const res = await fetch(path);

      if (res.ok) {
        const text = await res.text();
        this.parseTextToItems(basename(path), text, items);
      }
    } catch (error) {}

    this.cache.set(path, items);
  }

  async fetch(uri: Uri, path: string): Promise<string> {
    if (this.isRemote.test(path)) {
      await this.fetchRemote(path);
    } else {
      const base = basename(uri.fsPath, extname(uri.fsPath));

      path = this.getPath(uri, path.replace(/\${\s*fileBasenameNoExtension\s*}/, base));
      await this.fetchLocal(path);
    }

    return path;
  }

  findEmbedded(uri: Uri, keys: Set<string>, text: string) {
    const key = uri.toString();
    const items: CompletionItem[] = [];
    const findStyles = /(?:<style[^>]*>([^<]+)<\/style>|css\s*`([^`]+)`)/gi;

    let style: string[] | null;

    while ((style = findStyles.exec(text)) !== null) {
      this.parseTextToItems(basename(uri.fsPath), style[1] || style[2], items);
    }

    this.cache.set(key, items);
    keys.add(key);
  }

  async findFixed(uri: Uri, keys: Set<string>): Promise<void> {
    for (const key of this.getStyleSheets(uri)) {
      keys.add(await this.fetch(uri, key));
    }
  }

  async findLinks(uri: Uri, keys: Set<string>, text: string): Promise<void> {
    const findLinks = /<link([^>]+)>/gi;

    let link: string[] | null, rel: string[] | null, href: string[] | null;

    while ((link = findLinks.exec(text)) !== null) {
      rel = this.findLinkRel.exec(link[1]);

      if (rel && rel[2] === 'stylesheet') {
        href = this.findLinkHref.exec(link[1]);

        if (href) {
          keys.add(await this.fetch(uri, href[2]));
        }
      }
    }
  }

  async findInherited(uri: Uri, keys: Set<string>, text: string, level = 0): Promise<void> {
    const extended = this.findExtended.exec(text);

    if (extended && level < 3) {
      level++;

      const name = extended[2];
      const ext = extname(name) || extname(uri.fsPath);
      const path = this.getPath(uri, name, ext);
      const file = Uri.file(path);

      let text = this.files.get(path);

      if (!text) {
        try {
          text = (await workspace.readFile(file.toString())).toString();
        } catch (error) {
          text = 'n/a';
        }

        this.files.set(path, text);
        this.watchFile(path, () => this.files.delete(path));
      }

      this.findEmbedded(file, keys, text);

      await this.findLinks(file, keys, text);
      await this.findInherited(file, keys, text, level);
    }
  }

  async findAll(document: TextDocument): Promise<Context> {
    const keys = new Set<string>();
    const uri = document.uri;
    const text = document.getText();

    this.findEmbedded(Uri.parse(uri), keys, text);

    await this.findFixed(Uri.parse(uri), keys);
    await this.findLinks(Uri.parse(uri), keys, text);
    await this.findInherited(Uri.parse(uri), keys, text);

    const ids = new Map<string, CompletionItem>();
    const classes = new Map<string, CompletionItem>();

    keys.forEach(
      (key) =>
        this.cache.get(key)?.forEach((e) => {
          const res = e.kind === CompletionItemKind.Value ? ids : classes;
          // ---- custom fix ----
          e.label = e.label.replace('\\', '');
          e.insertText = e.label.replace('\\', '');
          // ---- /custom fix ----
          res.set(e.label, e);
        }),
    );

    return { ids, classes };
  }

  // MEMO: Not supported by coc-html-css-support.
  async validate(document: TextDocument): Promise<Diagnostic[]> {
    const context = await this.findAll(document);
    const text = document.getText();
    const diagnostics: Diagnostic[] = [];
    const findAttribute = /(id|class|className)\s*=\s*("|')(.*?)\2/gis;

    let attribute: string[] | null,
      offset: number,
      findSelector: RegExp,
      value: any[] | null,
      anchor: number,
      end: Position,
      start: Position;

    while ((attribute = findAttribute.exec(text)) !== null) {
      offset = findAttribute.lastIndex - attribute[3].length + attribute[3].indexOf(attribute[2]);

      findSelector = /([^(\[{}\])\s]+)(?![^(\[{]*[}\])])/gi;

      while ((value = findSelector.exec(attribute[3])) !== null) {
        if (!(attribute[1] === 'id' ? context.ids : context.classes).has(value[1])) {
          anchor = findSelector.lastIndex + offset;
          end = document.positionAt(anchor);
          start = document.positionAt(anchor - value[1].length);

          diagnostics.push(
            Diagnostic.create(
              Range.create(start, end),
              `CSS selector '${value[1]}' not found.`,
              DiagnosticSeverity.Information,
            ),
          );
        }
      }
    }

    return diagnostics;
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[]> {
    return new Promise((resolve) => {
      const range = Range.create(this.start, position);
      const text = document.getText(range);
      const canComplete = this.canComplete.exec(text);

      if (canComplete) {
        this.findAll(document).then((context) =>
          resolve([...(canComplete[1] === 'id' ? context.ids : context.classes).values()]),
        );
      } else {
        resolve([]);
      }
    });
  }
}
