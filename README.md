# coc-html-css-support

> fork from a [ecmel/vscode-html-css](https://github.com/ecmel/vscode-html-css) | [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

HTML `id` and `class` attribute completion for [coc.nvim](https://github.com/neoclide/coc.nvim).

<img width="780" alt="coc-html-css-support-demo" src="https://user-images.githubusercontent.com/188642/116341049-2b5c8880-a81b-11eb-959e-2d03edda61fd.gif">

## Install

`:CocInstall coc-html-css-support`

## Features

- HTML `id` and `class` attribute completion
- Supports completion from in file defined styles
- Supports specifying remote and local style sheets
- Supports any language for completion
- Supports go to definition for selectors
- Validates class attributes on demand
- Command to make `html.customData` built-in in `coc-html-css-support` available at the workspace level.
  - Require [coc-html](https://github.com/neoclide/coc-html)

## Enable Extension

- `html-css-support.enable`: Enable coc-html-css-support extension, default: `true`

## Supported Languages

Supported languages can be configured with the `html-css-support.enabledLanguages` global setting. By default `html` is enabled:

```json
{
  "html-css-support.enabledLanguages": ["html"]
}
```

Extension can be configured to support any language where it makes sense such as `nunjucks`, `twig`, `mustache`, `vue`, `typescript` etc.

## Specifying Style Sheets

Remote and local style sheets with optional glob patterns and variable substitutions can be specified in VS Code settings per workspace folder in coc-settings.json: and will suggest in all configured languages within that workspace folder.

Glob patterns for local style sheets can have the following syntax:

| Pattern | Matches                                               |
| ------- | ----------------------------------------------------- |
| `*`     | zero or more characters in a path segment             |
| `?`     | one character in a path segment                       |
| `**`    | any number of path segments, including none           |
| `{}`    | group conditions like `**​/*.{css,scss}`              |
| `[]`    | a range of characters like `[0-9]` or negate `[!0-9]` |

The following variable substitutions are supported for local style sheets as well:

| Variable                     | Substitution                              |
| ---------------------------- | ----------------------------------------- |
| `${fileBasename}`            | Current file's basename                   |
| `${fileBasenameNoExtension}` | Current file's basename with no extension |
| `${fileExtname}`             | Current file's extension                  |

## Examples

Configuration depends on your layout of the project. The following most basic setup will suggest from all `css` files in project's `src` folder:

**coc-settings.json:**

```json
{
  "html-css-support.styleSheets": ["src/**/*.css"]
}
```

### [Bootstrap](https://getbootstrap.com/)

If Bootstrap `npm` module is used with additional `scss` the following can be a starting point:

**coc-settings.json:**

```json
{
  "html-css-support.styleSheets": [
    "node_modules/bootstrap/dist/css/bootstrap.css",
    "src/**/*.scss"
  ]
}
```

or in case of Bootstrap CDN with additional plain `css`:

**coc-settings.json:**

```json
{
  "html-css-support.styleSheets": [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    "src/**/*.css"
  ]
}
```

All of Bootstrap's class selectors with additional user defined styles in the project will be available for completion in `html` files.

### [Lit](https://lit.dev/)

Enable `typescript` or `javascript` in global settings depending on your usage:

```json
{
  "html-css-support.enabledLanguages": ["html", "typescript"]
}
```

Component's [static styles](https://lit.dev/docs/components/styles/) will be available for completion elsewhere in the component. If you need to use some base styles in every component you can specify as follows:

**coc-settings.json:**

```json
{
  "html-css-support.styleSheets": ["src/base-styles.ts"]
}
```

Variable substitution can be used to refer to a related `css` file. If you are working on `my-component.ts` and your `css` is in `my-component-css.ts` then a suitable setup can be:

**coc-settings.json:**

```json
{
  "html-css-support.styleSheets": ["**/${fileBasenameNoExtension}-css.ts"]
}
```

### [Vue](https://vuejs.org/)

Install your favorite Vue language extension from CocInstall then enable `vue` in global settings:

```json
{
  "html-css-support.enabledLanguages": ["html", "vue"]
}
```

Styles defined in component's `<style>` section will be available for completion in component's `<template>` section.

### [Angular](https://angular.io/)

Variable substitution can be used for Angular development:

**coc-settings.json:**

```json
{
  "html-css-support.styleSheets": ["**/${fileBasenameNoExtension}.css"]
}
```

With this setup, styles defined in e.g. `app.component.css` will be available in `app.component.html`.

## Go to Definition

Go to definition for `id` and `class` selectors for local style sheets are supported. Selecting `Go to Definition` from context menu (`gd` with the default configuration) on a selector will open the local style sheet which the selector is defined.

## Commands

### Validate class selectors

Validates all `class` selectors in the active editor. Auto validation can be configured in extension settings globally or per workspace.

```
:CocCommand html-css-support.validate
```

### Clear style sheets cache

Clears style sheets cache.

```
:CocCommand html-css-support.clear
```

### Additional Custom date

- `html-css-support.customDataSetup`: Setup `html.customData` in workspace config. Supported customData are as follows
  - `Alpine.js`
  - `petite-vue`

## What is customData?

You can read more about customData in the following repositories.

- <https://github.com/microsoft/vscode-custom-data>
- <https://github.com/Microsoft/vscode-html-languageservice/blob/main/docs/customData.md>

## Thanks

- [ecmel/vscode-html-css](https://github.com/ecmel/vscode-html-css) : The origin of this repository.

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
