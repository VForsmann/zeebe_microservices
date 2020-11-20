import { html, customElement, LitElement, property, TemplateResult } from "lit-element";
import { NoShadowMixin } from "../../packages/page-mixin";

@customElement("web-modal")
export class WebModal extends NoShadowMixin(LitElement) {

    @property() content: TemplateResult = html``;

    render() {
        return html`
            ${this.content}
        `;
    }
}
