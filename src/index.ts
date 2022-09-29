import { html, LitElement, PropertyValueMap, render } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { tagName as tableIconTag, TableIcon } from "./icons/table-icon.js";
import { tagName as linkIconTag, LinkIcon } from "./icons/link-icon.js";
import { loadComponent } from "./helpers/index.js";
import { globalStyles } from "./styles/index.js";
import formStyles from "./styles/form.js";
import { markdownStyles } from "./styles/markdown.js";

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
  @property({ attribute: "name" })
  public name = "";
  @property({ attribute: "required", type: Boolean })
  public required = false;
  @query("textarea")
  protected textarea!: HTMLTextAreaElement;

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
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.renderToLightDom();
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
    this.value = this.textContent ?? "";
    this.textarea.addEventListener("input", () => {
      this.triggerInputEvent();
      this.renderToLightDom();
    });
  }

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
    const newSelectionStart = selectionStart + markdownSymbol.length;
    this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
    this.triggerInputEvent();
  };

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

  protected triggerInputEvent() {
    this.dispatchEvent(new Event("input", { composed: true }));
  }

  static styles = [globalStyles, formStyles, markdownStyles];

  renderToLightDom() {
    render(
      html`<textarea slot="input" name=${this.name} hidden .value=${this.value} ?required=${this.required}></textarea>`,
      this,
    );
  }

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

declare global {
  interface HTMLElementTagNameMap {
    "lit-markdown-editor": LitMarkdownEditor;
  }
}
