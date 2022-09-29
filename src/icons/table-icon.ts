import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import iconStyles from "../styles/icon";

export const tagName = "table-icon";

@customElement(tagName)
export class TableIcon extends LitElement {
  static styles = [iconStyles];
  render() {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      viewBox="0, 0, 48, 48"
    >
      <path
        d="M6 42V6h36v36Zm3-25h30V9H9Zm11 11h8v-8h-8Zm0 11h8v-8h-8ZM9 28h8v-8H9Zm22 0h8v-8h-8ZM9 39h8v-8H9Zm22 0h8v-8h-8Z"
      />
    </svg>`;
  }
}
