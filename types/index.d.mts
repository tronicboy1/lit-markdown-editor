import { LitElement } from "lit";
export declare const tagName = "markdown-textarea";
export declare class MarkdownTextarea extends LitElement {
    #private;
    name: string;
    required: boolean;
    protected textarea: HTMLTextAreaElement;
    get value(): string;
    set value(value: string);
    constructor();
    connectedCallback(): void;
    protected handleHeaderClick: EventListener;
    protected handleModifierClick: EventListener;
    protected handleTemplateClick: EventListener;
    protected triggerInputEvent(): void;
    static styles: import("lit").CSSResult[];
    renderToLightDom(): void;
    render(): import("lit-html").TemplateResult<1>;
}
