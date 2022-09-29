import { LitElement, PropertyValueMap } from "lit";
export declare const tagName = "lit-markdown-editor";
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
export declare class LitMarkdownEditor extends LitElement {
    #private;
    name: string;
    required: boolean;
    protected textarea: HTMLTextAreaElement;
    get value(): string;
    set value(value: string);
    constructor();
    connectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void;
    protected handleHeaderClick: EventListener;
    protected handleModifierClick: EventListener;
    protected handleTemplateClick: EventListener;
    protected triggerInputEvent(): void;
    static styles: import("lit").CSSResult[];
    renderToLightDom(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "lit-markdown-editor": LitMarkdownEditor;
    }
}
