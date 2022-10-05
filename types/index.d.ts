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
    private markdownMap;
    private controller;
    private internals;
    static formAssociated: boolean;
    protected loading: boolean;
    name: string;
    minlength: string;
    maxlength: string;
    protected textarea: HTMLTextAreaElement;
    protected fileInput: HTMLInputElement;
    private enterKeyWasPressed;
    private enterKeyResetTimeout;
    get required(): boolean;
    set required(newVal: boolean);
    /**
     * Acts as an intermediate for this element to behave like a textarea.
     */
    get value(): string;
    set value(value: string);
    constructor();
    protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void;
    disconnectedCallback(): void;
    /**
     * Appends text to textarea.
     * Uses deprecated execCommand if available and defaults to substitution if fails.
     */
    private appendTextToTextArea;
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
    protected handleLinkClick: EventListener;
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
     * Renders a file to the text area as markdown text with a link to the objects URL.
     */
    private renderImageToTextArea;
    /**
     * Processes a file for uploading to hosting provider before being rendered in the text editor.
     * By default, will simply return an object URL for the file.
     */
    protected provideFileURL(file: File): Promise<string>;
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
    /**
     * Handles keydown event and adds a new line for lists.
     */
    private handleKeydown;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "lit-markdown-editor": LitMarkdownEditor;
    }
}
