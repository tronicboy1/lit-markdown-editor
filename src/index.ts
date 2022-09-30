import { html, LitElement, PropertyValueMap, render } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { tagName as tableIconTag, TableIcon } from "./icons/table-icon.js";
import { tagName as linkIconTag, LinkIcon } from "./icons/link-icon.js";
import { loadComponent } from "./helpers/index.js";
import { globalStyles } from "./styles/index.js";
import formStyles from "./styles/form.js";
import { markdownStyles } from "./styles/markdown.js";
import { tagName as newPictureIconTagName, NewPictureIcon } from "./icons/new-picture-icon.js";

export const tagName = "lit-markdown-editor";

/**
 * A markdown editor text area built using Lit
 *
 * Usage in lit:
 * @example import "lit-markdown-editor"
 * ...
 * render() {
 *    return html`<lit-markdown-editor name="markdown" id="markdown"></lit-markdown-editor>`
 * }
 *
 * Adding event listeners:
 * @example
 * <script>
 * const litMarkdownEditorElement = document.querySelector("lit-markdown-editor");
 * litMarkdownEditorElement.addEventListener("input", () => console.log(litMarkdownEditorElement.value))
 * </script>
 */
@customElement(tagName)
export class LitMarkdownEditor extends LitElement {
  #markdownMap: Map<string, string>;
  #controller = new AbortController();
  @property({ attribute: "name" })
  public name = "";
  @property({ attribute: "required", type: Boolean })
  public required = false;
  @query("textarea")
  protected textarea!: HTMLTextAreaElement;
  @query("input#add-file")
  protected fileInput!: HTMLInputElement;

  /**
   * Acts as an intermediate for this element to behave like a textarea.
   */
  get value() {
    return this.textarea?.value ?? "";
  }
  set value(value: string) {
    if (typeof value !== "string") throw TypeError("Value must be string.");
    if (!this.textarea) throw Error("Cannot set textarea value before render.");
    this.textarea.value = value;
    this.renderToLightDom();
  }

  constructor() {
    super();
    this.#markdownMap = new Map([
      ["h1", "#"],
      ["h2", "##"],
      ["h3", "###"],
      ["h4", "####"],
      ["h5", "#####"],
      ["i", "_"],
      ["b", "**"],
      ["table", "| A | B |" + "\n" + "| --- | --- |" + "\n" + "| a | b |"],
      ["link", '[URL]("https://")'],
    ]);
    loadComponent(tableIconTag, TableIcon);
    loadComponent(linkIconTag, LinkIcon);
    loadComponent(newPictureIconTagName, NewPictureIcon);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.renderToLightDom();
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
    this.value = this.textContent ?? "";
    this.textarea.addEventListener(
      "input",
      () => {
        this.renderToLightDom();
      },
      { signal: this.#controller.signal },
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#controller.abort();
  }

  /**
   * Renders header Markdown symbols into the textarea.
   */
  protected handleHeaderClick: EventListener = (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) throw TypeError();
    const id = target.id;
    const markdownSymbol = this.#markdownMap.get(id) ?? "";
    const { selectionStart, value } = this.textarea;
    const isFullParagraph = selectionStart ? value.at(selectionStart - 1) === "\n" : true;
    const newValue = `${value.substring(0, selectionStart)}${
      isFullParagraph ? "" : "\n"
    }${markdownSymbol} ${value.substring(selectionStart)}`;
    this.textarea.value = newValue;
    this.textarea.focus();
    const newSelectionStart = selectionStart + markdownSymbol.length + 2;
    this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
    this.triggerInputEvent();
  };

  /**
   * Handles a click to modifiers like italics.
   * The textarea selection will be set to the middle of symbols.
   */
  protected handleModifierClick: EventListener = (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) throw TypeError();
    const id = target.id;
    const markdownSymbol = this.#markdownMap.get(id) ?? "";
    const { selectionStart, selectionEnd, value } = this.textarea;
    const newValue = `${value.substring(0, selectionStart)} ${markdownSymbol}${value.substring(
      selectionStart,
      selectionEnd,
    )}${markdownSymbol} ${value.substring(selectionEnd)}`;
    this.textarea.value = newValue;
    this.textarea.focus();
    const newSelectionStart = selectionStart + markdownSymbol.length + 1;
    this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
    this.triggerInputEvent();
  };

  /**
   * Renders templates when a template icon is clicked.
   */
  protected handleTemplateClick: EventListener = (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) throw TypeError();
    const id = target.id;
    const markdownSymbol = this.#markdownMap.get(id) ?? "";
    const { selectionStart, value } = this.textarea;
    const newLine = "\n";
    const newValue =
      value.substring(0, selectionStart) + newLine + markdownSymbol + newLine + value.substring(selectionStart);
    this.textarea.value = newValue;
    this.textarea.focus();
    this.textarea.setSelectionRange(selectionStart, selectionStart);
    this.triggerInputEvent();
  };

  /**
   * Opens file selection dialogue on a click to the add picture icon.
   */
  protected handleAddPictureClick: EventListener = () => {
    this.fileInput.click();
  };

  /**
   * Handles file input when add picture button is clicked
   */
  protected handleFileInput: EventListener = () => {
    const { files } = this.fileInput;
    if (!files) throw Error("No files object was found on input");
    const file = files[0];
    if (!file || file.size === 0) return;
    this.handleFileRender(file);
  };

  /**
   * Handles a file drop on the textarea element.
   * Can render multiple files at once.
   */
  protected handleDrop = (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) return;
    const { files } = event.dataTransfer;
    const filesArray = Array.from(files);
    for (const file of filesArray) {
      const { type } = file;
      const regex = /(image|video)\/.*/;
      if (!regex.test(type)) continue;
      this.handleFileRender(file);
    }
  };

  /**
   * Renders a file to the text area as markdown text.
   * By default, this function will also register the image as an Object URL so it may be displayed in an img tag.
   */
  protected handleFileRender = (file: File) => {
    const objectURL = URL.createObjectURL(file);
    const markdown = `![${file.name}](${objectURL} "${file.name}")`;
    const { selectionStart, selectionEnd, value } = this.textarea;
    const textUntilSelectionStart = value.substring(0, selectionStart);
    const textAfterSelectionEnd = value.substring(selectionEnd);
    const newLine = "\n";
    this.textarea.value = textUntilSelectionStart + newLine + markdown + textAfterSelectionEnd + newLine;
    this.triggerInputEvent();
    this.renderToLightDom();
    this.textarea.focus();
    const newSelectionStart = selectionStart + markdown.length + 1;
    this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
  };

  /**
   * Triggers input event on button clicks.
   */
  protected triggerInputEvent() {
    this.dispatchEvent(new Event("input", { composed: true }));
  }

  static styles = [globalStyles, formStyles, markdownStyles];

  /**
   * Renders a hidden textarea to the lightdom so this element can be used with forms.
   * Will use element internals later.
   */
  renderToLightDom() {
    render(
      html`<textarea slot="input" name=${this.name} hidden .value=${this.value} ?required=${this.required}></textarea>`,
      this,
    );
  }

  render() {
    return html`
      <input @input=${this.handleFileInput} id="add-file" type="file" hidden accept="image/*" />
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
          <li @click=${this.handleAddPictureClick} style="position: relative;">
            <new-picture-icon></new-picture-icon>
          </li>
        </ul>
      </nav>
      <textarea name=${this.name} autocomplete="off" maxlength="5000" @drop=${this.handleDrop}></textarea>
      <slot name="input"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-markdown-editor": LitMarkdownEditor;
  }
}
