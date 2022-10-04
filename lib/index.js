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
import { tagName as bulletListIconTag, BulletListIcon } from "./icons/bullet-list-icon.js";
import { tagName as numberListIconTag, NumberListIcon } from "./icons/number-list-icon.js";
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
            const newText = `${isFullParagraph ? "" : "\n"}${markdownSymbol} `;
            const padding = markdownSymbol.length + 2;
            this.appendTextToTextArea(newText, padding);
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
            const newValue = ` ${markdownSymbol}${value.substring(selectionStart, selectionEnd)}${markdownSymbol} `;
            const padding = markdownSymbol.length + 1;
            this.appendTextToTextArea(newValue, padding);
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
            const newLine = "\n";
            const newValue = newLine + markdownSymbol + newLine;
            this.appendTextToTextArea(newValue);
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
            this.provideFileURL(file)
                .then((url) => this.renderImageToTextArea(file, url))
                .finally(() => {
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
            Promise.all(filteredFiles.map((file) => {
                return this.provideFileURL(file).then((url) => this.renderImageToTextArea(file, url));
            })).finally(() => {
                this.loading = false;
            });
        };
        /**
         * Handles keydown event and adds a new line for lists.
         */
        this.handleKeydown = (event) => {
            if (event.isComposing)
                return;
            if (event.key !== "Enter")
                return;
            const { selectionStart, value } = this.textarea;
            const startOfParagraph = value.lastIndexOf("\n", selectionStart - 2);
            const currentParagraph = value.slice(startOfParagraph + 1, selectionStart);
            const olRegex = /^([1-9][0-9]*). .+/;
            const isOl = currentParagraph.match(olRegex);
            const ulRegex = / - .+/;
            const isUl = currentParagraph.match(ulRegex);
            if (isOl || isUl) {
                event.preventDefault();
                const symbol = isOl ? `\n${Number(isOl[1]) + 1}. ` : "\n - ";
                this.appendTextToTextArea(symbol, symbol.length);
            }
        };
        const elementInternalsSupported = "attachInternals" in this;
        this.internals = elementInternalsSupported ? this.attachInternals() : null;
        this.markdownMap = new Map([
            ["h1", "#"],
            ["h2", "##"],
            ["h3", "###"],
            ["h4", "####"],
            ["h5", "#####"],
            ["ul", " - "],
            ["ol", "1. "],
            ["i", "_"],
            ["b", "**"],
            ["table", "| A | B |" + "\n" + "| --- | --- |" + "\n" + "| a | b |"],
            ["link", "[URL](https://)"],
        ]);
        loadComponent(tableIconTag, TableIcon);
        loadComponent(linkIconTag, LinkIcon);
        loadComponent(newPictureIconTagName, NewPictureIcon);
        loadComponent(loadingIconTagName, LoadingIcon);
        loadComponent(bulletListIconTag, BulletListIcon);
        loadComponent(numberListIconTag, NumberListIcon);
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
     * Appends text to textarea.
     * Uses deprecated execCommand if available and defaults to substitution if fails.
     */
    appendTextToTextArea(textToAdd, selectionPadding = 1) {
        const { selectionStart, selectionEnd, value } = this.textarea;
        const newSelectionStart = selectionStart + selectionPadding;
        const execCommandSupported = "execCommand" in document;
        if (execCommandSupported) {
            this.textarea.focus();
            this.textarea.setSelectionRange(selectionStart, selectionEnd);
            const succeeded = document.execCommand("insertText", false, textToAdd);
            if (succeeded) {
                this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
                return;
            }
        }
        const textUntilSelectionStart = value.substring(0, selectionStart);
        const textAfterSelectionEnd = value.substring(selectionEnd);
        this.value = textUntilSelectionStart + textToAdd + textAfterSelectionEnd;
        this.textarea.focus();
        this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
    }
    /**
     * Renders a file to the text area as markdown text with a link to the objects URL.
     */
    renderImageToTextArea(file, url) {
        const markdown = `![${file.name}](${url} "${file.name}")`;
        const padding = markdown.length + 1;
        this.appendTextToTextArea(markdown, padding);
    }
    /**
     * Processes a file for uploading to hosting provider before being rendered in the text editor.
     * By default, will simply return an object URL for the file.
     */
    provideFileURL(file) {
        const objectURL = URL.createObjectURL(file);
        return Promise.resolve(objectURL);
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
          <li @click=${this.handleHeaderClick} id="ul"><bullet-list-icon></bullet-list-icon></li>
          <li @click=${this.handleHeaderClick} id="ol"><number-list-icon></number-list-icon></li>
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
      <textarea name=${this.name} autocomplete="off" @drop=${this.handleDrop} @keydown=${this.handleKeydown}></textarea>
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