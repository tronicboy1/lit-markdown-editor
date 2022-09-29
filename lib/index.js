var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LitMarkdownEditor_markdownMap;
import { html, LitElement, render } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { tagName as tableIconTag, TableIcon } from "./icons/table-icon";
import { tagName as linkIconTag, LinkIcon } from "./icons/link-icon";
import { loadComponent } from "./helpers";
import { globalStyles } from "./styles";
import formStyles from "./styles/form";
import { markdownStyles } from "./styles/markdown";
export const tagName = "lit-markdown-editor";
let LitMarkdownEditor = class LitMarkdownEditor extends LitElement {
    constructor() {
        super();
        _LitMarkdownEditor_markdownMap.set(this, void 0);
        this.name = "";
        this.required = false;
        this.handleHeaderClick = (event) => {
            var _a;
            const target = event.currentTarget;
            if (!(target instanceof HTMLElement))
                throw TypeError();
            const id = target.id;
            const markdownSymbol = (_a = __classPrivateFieldGet(this, _LitMarkdownEditor_markdownMap, "f").get(id)) !== null && _a !== void 0 ? _a : "";
            const { selectionStart, value } = this.textarea;
            const isFullParagraph = selectionStart ? value.at(selectionStart - 1) === "\n" : true;
            const newValue = `${value.substring(0, selectionStart)}${isFullParagraph ? "" : "\n"}${markdownSymbol} ${value.substring(selectionStart)}`;
            this.textarea.value = newValue;
            this.textarea.focus();
            const newSelectionStart = selectionStart + markdownSymbol.length + 2;
            this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
            this.triggerInputEvent();
        };
        this.handleModifierClick = (event) => {
            var _a;
            const target = event.currentTarget;
            if (!(target instanceof HTMLElement))
                throw TypeError();
            const id = target.id;
            const markdownSymbol = (_a = __classPrivateFieldGet(this, _LitMarkdownEditor_markdownMap, "f").get(id)) !== null && _a !== void 0 ? _a : "";
            const { selectionStart, selectionEnd, value } = this.textarea;
            const newValue = `${value.substring(0, selectionStart)} ${markdownSymbol}${value.substring(selectionStart, selectionEnd)}${markdownSymbol} ${value.substring(selectionEnd)}`;
            this.textarea.value = newValue;
            this.textarea.focus();
            const newSelectionStart = selectionStart + markdownSymbol.length;
            this.textarea.setSelectionRange(newSelectionStart, newSelectionStart);
            this.triggerInputEvent();
        };
        this.handleTemplateClick = (event) => {
            var _a;
            const target = event.currentTarget;
            if (!(target instanceof HTMLElement))
                throw TypeError();
            const id = target.id;
            const markdownSymbol = (_a = __classPrivateFieldGet(this, _LitMarkdownEditor_markdownMap, "f").get(id)) !== null && _a !== void 0 ? _a : "";
            const { selectionStart, value } = this.textarea;
            const newLine = "\n";
            const newValue = value.substring(0, selectionStart) + newLine + markdownSymbol + newLine + value.substring(selectionStart);
            this.textarea.value = newValue;
            this.textarea.focus();
            this.textarea.setSelectionRange(selectionStart, selectionStart);
            this.triggerInputEvent();
        };
        __classPrivateFieldSet(this, _LitMarkdownEditor_markdownMap, new Map([
            ["h1", "#"],
            ["h2", "##"],
            ["h3", "###"],
            ["h4", "####"],
            ["h5", "#####"],
            ["i", "_"],
            ["b", "**"],
            ["table", "| A | B |" + "\n" + "| --- | --- |" + "\n" + "| a | b |"],
            ["link", '[Pace]("https://www.pace-coffee.com")'],
        ]), "f");
        loadComponent(tableIconTag, TableIcon);
        loadComponent(linkIconTag, LinkIcon);
    }
    get value() {
        return this.textarea.value;
    }
    set value(value) {
        if (typeof value !== "string")
            throw TypeError("Value must be string.");
        if (!this.textarea)
            return;
        this.textarea.value = value;
        this.renderToLightDom();
    }
    connectedCallback() {
        var _a;
        super.connectedCallback();
        this.value = (_a = this.textContent) !== null && _a !== void 0 ? _a : "";
        this.textarea.addEventListener("input", () => {
            this.triggerInputEvent();
            this.renderToLightDom();
        });
    }
    triggerInputEvent() {
        this.dispatchEvent(new Event("input", { composed: true }));
    }
    renderToLightDom() {
        render(html `<textarea slot="input" name=${this.name} hidden .value=${this.value} ?required=${this.required}></textarea>`, this);
    }
    render() {
        return html `
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
};
_LitMarkdownEditor_markdownMap = new WeakMap();
LitMarkdownEditor.styles = [globalStyles, formStyles, markdownStyles];
__decorate([
    property({ attribute: "name" })
], LitMarkdownEditor.prototype, "name", void 0);
__decorate([
    property({ attribute: "required", type: Boolean })
], LitMarkdownEditor.prototype, "required", void 0);
__decorate([
    query("textarea")
], LitMarkdownEditor.prototype, "textarea", void 0);
LitMarkdownEditor = __decorate([
    customElement(tagName)
], LitMarkdownEditor);
export { LitMarkdownEditor };
//# sourceMappingURL=index.js.map