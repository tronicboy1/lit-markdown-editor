# About this Package

This package is a web component written using Lit to provide simple tools for writing markdown in the browser.

Most markdown tools are very complicated; this component aims to offer a very unsophisticated solution.

# Dependencies

This package uses [Lit](https://lit.dev/) as a basis for the web component.

# Accredations

The icons used in this element are from [Google Fonts](https://fonts.google.com/).

# Usage

## In the browser

This component can be used out of the box in browsers that support import maps:

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="importmap">
      {
        "imports": {
          "lit": "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js",
          "lit/decorators.js": "https://unpkg.com/lit/decorators.js",
          "@lit/reactive-element": "https://unpkg.com/@lit/reactive-element/reactive-element.js",
          "@lit/reactive-element/": "https://unpkg.com/@lit/reactive-element/",
          "lit-markdown-editor": "https://cdn.jsdelivr.net/npm/lit-markdown-editor@1.0.11/lib/index.js"
        }
      }
    </script>
  </head>

  <body>
    <lit-markdown-editor></lit-markdown-editor>
    <script type="module">
      import "lit-markdown-editor";
    </script>
  </body>
</html>
```

## With Lit

This element can be used in a Lit building environment as shown below:

```typescript
import { LitElement, html, PropertyValueMap } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { resolveMarkdown } from "lit-markdown";
import "lit-markdown-editor";

@customElement("my-element")
export class MyElement extends LitElement {
  @query("lit-markdown-editor")
  private textarea!: HTMLTextAreaElement;
  @state()
  private raw = "";

  firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties);
    this.textarea.addEventListener("input", this.handleTextareaInput);
  }

  private handleTextareaInput: EventListener = () => {
    const { value } = this.textarea;
    if (!value) return;
    this.raw = value.trim();
  };

  render() {
    return html`<label for="markdown">Input</label
      ><lit-markdown-editor name="markdown" id="markdown"></lit-markdown-editor>
      <p>Output</p>
      <article>${resolveMarkdown(this.raw, { includeImages: true })}</article>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
```

## Extending with Lit

You may also extend this element class in Lit and customize the buttons:

```typescript
import { LitMarkdownEditor } from "lit-markdown-editor";
import { html } from "lit";

export class CustomMarkdownEditor extends LitMarkdownEditor {
  render() {
    return html`
      <nav>
        <ul>
          <li @click=${this.handleHeaderClick} id="h1">H1</li>
          <li @click=${this.handleHeaderClick} id="h2">H2</li>
          <li @click=${this.handleHeaderClick} id="h3">H3</li>
          <li @click=${this.handleHeaderClick} id="h4">H4</li>
          <li @click=${this.handleHeaderClick} id="h5">H5</li>
          <li @click=${this.handleModifierClick} id="i"><em>i</em></li>
          <li @click=${this.handleModifierClick} id="b"><strong>B</strong></li>
          <li @click=${this.handleTemplateClick} id="table">
            <table-icon></table-icon>
          </li>
          <li @click=${this.handleTemplateClick} id="link">
            <link-icon></link-icon>
          </li>
        </ul>
      </nav>
      <textarea name=${this.name} autocomplete="off" maxlength="5000"></textarea>
      <slot name="input"></slot>
    `;
  }
}
```

## Loading Initial Values

You can load initial values by dumping text data inside the `<lit-markdown-editor></lit-markdown-editor>` element:

### In a Template

```html
<lit-markdown-editor name="markdown" id="markdown">
  # Rick and Morty _Wub a lub a dub dub!_ **speaks to my soul**.
</lit-markdown-editor>
```

### Through Javascript

```html
<lit-markdown-editor name="markdown" id="markdown"></lit-markdown-editor>
<script>
  const editor = document.querySelector("lit-markdown-editor");
  const cache = window.localStorage.getItem("cache");
  if (cache) {
    editor.innerHTML = cache;
  }
</script>
```

## About the Add Image button

The add image button will add your image as a data object string by default.

If you wish to change the logic of the add image button, please create a custom class and modify the `protected handleHeaderClick` EventListener.
