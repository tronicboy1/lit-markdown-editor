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
    protected fileInput: HTMLInputElement;
    /**
     * Acts as an intermediate for this element to behave like a textarea.
     */
    get value(): string;
    set value(value: string);
    constructor();
    connectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void;
    disconnectedCallback(): void;
    /**
     * Renders header Markdown symbols into the textarea.
     */
    protected handleHeaderClick: EventListener;
    /**
     * Handles a click to modifiers like italics.
     * The textarea selection will be set to the middle of symbols.
     */
    protected handleModifierClick: EventListener;
    /**
     * Renders templates when a template icon is clicked.
     */
    protected handleTemplateClick: EventListener;
    /**
     * Opens file selection dialogue on a click to the add picture icon.
     */
    protected handleAddPictureClick: EventListener;
    /**
     * Handles file input when add picture button is clicked
     */
    protected handleFileInput: EventListener;
    /**
     * Handles a file drop on the textarea element.
     * Can render multiple files at once.
     */
    protected handleDrop: (event: DragEvent) => void;
    /**
     * Renders a file to the text area as markdown text.
     * By default, this function will also register the image as an Object URL so it may be displayed in an img tag.
     */
    protected handleFileRender: (file: File) => void;
    /**
     * Triggers input event on button clicks.
     */
    protected triggerInputEvent(): void;
    static styles: import("lit").CSSResult[];
    /**
     * Renders a hidden textarea to the lightdom so this element can be used with forms.
     * Will use element internals later.
     */
    renderToLightDom(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "lit-markdown-editor": LitMarkdownEditor;
    }
}
