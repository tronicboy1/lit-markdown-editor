import { LitElement, PropertyValueMap } from "lit";
export declare const tagName = "lit-markdown-editor";
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
