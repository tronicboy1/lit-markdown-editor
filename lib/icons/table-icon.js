var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import iconStyles from "../styles/icon";
export const tagName = "table-icon";
let TableIcon = class TableIcon extends LitElement {
    render() {
        return html `<svg
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
};
TableIcon.styles = [iconStyles];
TableIcon = __decorate([
    customElement(tagName)
], TableIcon);
export { TableIcon };
//# sourceMappingURL=table-icon.js.map