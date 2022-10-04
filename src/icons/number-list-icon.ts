import { html, LitElement } from "lit";
import iconStyles from "../styles/icon.js";

export const tagName = "number-list-icon";

export class NumberListIcon extends LitElement {
  static styles = [iconStyles];
  render() {
    return html`<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0, 0, 48, 48">
      <path
        d="M6 40v-1.7h4.2V37H8.1v-1.7h2.1V34H6v-1.7h5.9V40Zm10.45-2.45v-3H42v3ZM6 27.85v-1.6l3.75-4.4H6v-1.7h5.9v1.6l-3.8 4.4h3.8v1.7Zm10.45-2.45v-3H42v3ZM8.1 15.8V9.7H6V8h3.8v7.8Zm8.35-2.55v-3H42v3Z"
      />
    </svg>`;
  }
}
