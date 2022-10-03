var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _LitMarkdownEditor_required;
import { html, LitElement, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { tagName as tableIconTag, TableIcon } from "./icons/table-icon.js";
import { tagName as linkIconTag, LinkIcon } from "./icons/link-icon.js";
import { loadComponent } from "./helpers/index.js";
import { globalStyles } from "./styles/index.js";
import formStyles from "./styles/form.js";
import { markdownStyles } from "./styles/markdown.js";
import { tagName as newPictureIconTagName, NewPictureIcon } from "./icons/new-picture-icon.js";
import { tagName as loadingIconTagName, LoadingIcon } from "./icons/loading-icon.js";
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
let LitMarkdownEditor = class LitMarkdownEditor extends LitElement {
    constructor() {
        super();
        this.controller = new AbortController();
        this.loading = false;
        this.name = "";
        this.minlength = "";
        this.maxlength = "";
        _LitMarkdownEditor_required.set(this, false);
        /**
         * Renders header Markdown symbols into the textarea.
         */
        this.handleHeaderClick = (event) => {
            var _a;
            const target = event.currentTarget;
            if (!(target instanceof HTMLElement))
                throw TypeError();
            const id = target.id;
            const markdownSymbol = (_a = this.markdownMap.get(id)) !== null && _a !== void 0 ? _a : "";
            const { selectionStart, value } = this.textarea;
            const isFullParagraph = selectionStart ? value.at(selectionStart - 1) === "\n" : true;
            const newValue = `${value.substring(0, selectionStart)}${isFullParagraph ? "" : "\n"}${markdownSymbol} ${value.substring(selectionStart)}`;
            this.value = newValue;
            this.textarea.focus();
            const newSelectionStart = selectionStart + markdownSymbol.length + 2;
            this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
        };
        /**
         * Handles a click to modifiers like italics.
         * The textarea selection will be set to the middle of symbols.
         */
        this.handleModifierClick = (event) => {
            var _a;
            const target = event.currentTarget;
            if (!(target instanceof HTMLElement))
                throw TypeError();
            const id = target.id;
            const markdownSymbol = (_a = this.markdownMap.get(id)) !== null && _a !== void 0 ? _a : "";
            const { selectionStart, selectionEnd, value } = this.textarea;
            const newValue = `${value.substring(0, selectionStart)} ${markdownSymbol}${value.substring(selectionStart, selectionEnd)}${markdownSymbol} ${value.substring(selectionEnd)}`;
            this.value = newValue;
            this.textarea.focus();
            const newSelectionStart = selectionStart + markdownSymbol.length + 1;
            this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
        };
        /**
         * Renders templates when a template icon is clicked.
         */
        this.handleTemplateClick = (event) => {
            var _a;
            const target = event.currentTarget;
            if (!(target instanceof HTMLElement))
                throw TypeError();
            const id = target.id;
            const markdownSymbol = (_a = this.markdownMap.get(id)) !== null && _a !== void 0 ? _a : "";
            const { selectionStart, value } = this.textarea;
            const newLine = "\n";
            const newValue = value.substring(0, selectionStart) + newLine + markdownSymbol + newLine + value.substring(selectionStart);
            this.value = newValue;
            this.textarea.focus();
            this.textarea.setSelectionRange(selectionStart, selectionStart);
        };
        /**
         * Opens file selection dialogue on a click to the add picture icon.
         */
        this.handleAddPictureClick = () => {
            if (this.loading)
                return;
            this.fileInput.click();
        };
        /**
         * Handles file input when add picture button is clicked
         */
        this.handleFileInput = (event) => {
            event.stopPropagation(); // stop input event from bleeding through to light DOM
            const { files } = this.fileInput;
            if (!files)
                throw Error("No files object was found on input");
            const file = files[0];
            if (!file || file.size === 0)
                return;
            this.loading = true;
            this.handleFileRender(file).finally(() => {
                this.loading = false;
                this.fileInput.value = "";
            });
        };
        /**
         * Handles a file drop on the textarea element.
         * Can render multiple files at once.
         */
        this.handleDrop = (event) => {
            event.preventDefault();
            if (this.loading || !event.dataTransfer)
                return;
            const { files } = event.dataTransfer;
            const filesArray = Array.from(files);
            const regex = /(image|video)\/.*/;
            const filteredFiles = filesArray.filter(({ type }) => regex.test(type));
            this.loading = true;
            Promise.all(filteredFiles.map((file) => this.handleFileRender(file))).finally(() => {
                this.loading = false;
            });
        };
        /**
         * Renders a file to the text area as markdown text.
         * By default, this function will also register the image as an Object URL so it may be displayed in an img tag.
         * This function is intentionally created to return a promise for use with async uploads.
         * If you do not require async handling, simply return a Promise.resolve().
         */
        this.handleFileRender = (file) => {
            const objectURL = URL.createObjectURL(file);
            const markdown = `![${file.name}](${objectURL} "${file.name}")`;
            const { selectionStart, selectionEnd, value } = this.textarea;
            const textUntilSelectionStart = value.substring(0, selectionStart);
            const textAfterSelectionEnd = value.substring(selectionEnd);
            const newLine = "\n";
            this.value = textUntilSelectionStart + newLine + markdown + textAfterSelectionEnd + newLine;
            this.textarea.focus();
            const newSelectionStart = selectionStart + markdown.length + 1;
            this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
            return Promise.resolve();
        };
        const elementInternalsSupported = "attachInternals" in this;
        this.internals = elementInternalsSupported ? this.attachInternals() : null;
        this.markdownMap = new Map([
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
        loadComponent(loadingIconTagName, LoadingIcon);
    }
    get required() {
        return __classPrivateFieldGet(this, _LitMarkdownEditor_required, "f");
    }
    set required(newVal) {
        __classPrivateFieldSet(this, _LitMarkdownEditor_required, newVal, "f");
        this.internals && (this.internals.ariaRequired = String(this.required));
        this.renderToLightDom();
    }
    /**
     * Acts as an intermediate for this element to behave like a textarea.
     */
    get value() {
        var _a, _b;
        return (_b = (_a = this.textarea) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
    }
    set value(value) {
        if (typeof value !== "string")
            throw TypeError("Value must be string.");
        if (!this.textarea)
            throw Error("Cannot set textarea value before render.");
        this.textarea.value = value;
        this.renderToLightDom();
        this.triggerInputEvent();
    }
    firstUpdated(_changedProperties) {
        var _a;
        super.firstUpdated(_changedProperties);
        this.value = (_a = this.textContent) !== null && _a !== void 0 ? _a : "";
        this.renderToLightDom();
        this.textarea.addEventListener("input", () => {
            this.renderToLightDom();
        }, { signal: this.controller.signal });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.controller.abort();
    }
    /**
     * Triggers input event on button clicks.
     */
    triggerInputEvent() {
        this.dispatchEvent(new Event("input", { composed: true }));
    }
    /**
     * Renders a hidden textarea to the lightdom so this element can be used with forms.
     * Will use element internals later.
     */
    renderToLightDom() {
        if (!this.textarea)
            return; // Do not allow render until element is fully loaded.
        if (!this.internals) {
            render(html `<textarea
          slot="input"
          name=${this.name}
          hidden
          .value=${this.value}
          ?required=${this.required}
        ></textarea>`, this);
            return;
        }
        this.internals.setFormValue(this.value);
        if (this.required && this.value.length === 0)
            return this.internals.setValidity({ valueMissing: true }, "Editor is empty.", this.textarea);
        const maxlengthNum = Number(this.maxlength);
        if (Boolean(maxlengthNum) && this.value.length > maxlengthNum)
            return this.internals.setValidity({ tooLong: true }, `Max character length is ${this.maxlength} characters. Current character length is ${this.value.length}.`, this.textarea);
        const minlengthNum = Number(this.minlength);
        if (Boolean(minlengthNum) && this.value.length < minlengthNum)
            return this.internals.setValidity({ tooShort: true }, `At least ${this.minlength} characters are required.`, this.textarea);
        this.internals.setValidity({});
    }
    render() {
        return html `
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
            ${this.loading
            ? html `<loading-icon small black></loading-icon>`
            : html `<new-picture-icon></new-picture-icon>`}
          </li>
        </ul>
      </nav>
      <textarea name=${this.name} autocomplete="off" @drop=${this.handleDrop}></textarea>
      <slot name="input"></slot>
    `;
    }
};
_LitMarkdownEditor_required = new WeakMap();
LitMarkdownEditor.formAssociated = true;
LitMarkdownEditor.styles = [globalStyles, formStyles, markdownStyles];
__decorate([
    state()
], LitMarkdownEditor.prototype, "loading", void 0);
__decorate([
    property({ attribute: "name" })
], LitMarkdownEditor.prototype, "name", void 0);
__decorate([
    property({ attribute: "minlength" })
], LitMarkdownEditor.prototype, "minlength", void 0);
__decorate([
    property({ attribute: "maxlength" })
], LitMarkdownEditor.prototype, "maxlength", void 0);
__decorate([
    query("textarea")
], LitMarkdownEditor.prototype, "textarea", void 0);
__decorate([
    query("input#add-file")
], LitMarkdownEditor.prototype, "fileInput", void 0);
__decorate([
    property({ attribute: "required", type: Boolean })
], LitMarkdownEditor.prototype, "required", null);
LitMarkdownEditor = __decorate([
    customElement(tagName)
], LitMarkdownEditor);
export { LitMarkdownEditor };
//# sourceMappingURL=index.js.map