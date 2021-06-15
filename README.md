# coc-html-css-support

> fork from a [ecmel/vscode-html-css](https://github.com/ecmel/vscode-html-css) | [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

HTML id and class attribute "completion" for [coc.nvim](https://github.com/neoclide/coc.nvim).

<img width="780" alt="coc-html-css-support-demo" src="https://user-images.githubusercontent.com/188642/116341049-2b5c8880-a81b-11eb-959e-2d03edda61fd.gif">

## Install

`:CocInstall coc-html-css-support`

## Features

- HTML id and class attribute completion.
- Supports linked and embedded style sheets.
- Supports template inheritance.
- Supports additional style sheets.
- Supports other HTML like languages.

## Configuration options

- `html-css-support.enable`: Enable coc-html-css-support extension, default: `true`
- `html-css-support.enabledLanguages`: List of languages which suggestions are desired, default: `["html"]`
- `html-css-support.styleSheets`: List of local or remote style sheets for suggestions, default: `[]`

## Commands

- `html-css-support.dispose`: Clear cache and reload the stylesheet

## Example settings

### Additional Style Sheets (Example)

**coc-settings.json:**

```json
{
    "html-css-support.styleSheets": [
        "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
        "/style.css",
        "style.css"
    ]
}
```

### Add other HTML like languages (Example)

**coc-settings.json:**

```json
{
    "html-css-support.enabledLanguages": [
        "html",
        "vue",
        "blade",
        "htmldjango",
        "typescriptreact",
        "javascriptreact"
    ]
}
```

## Thanks

- [ecmel/vscode-html-css](https://github.com/ecmel/vscode-html-css) : The origin of this repository.

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
