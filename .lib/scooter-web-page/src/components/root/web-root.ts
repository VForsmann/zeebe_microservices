import { html, customElement, LitElement } from "lit-element";
import { NoShadowMixin } from "../../packages/page-mixin";

@customElement("web-root")
export class WebRoot extends NoShadowMixin(LitElement) {
    render() {
        return html`
            <vaadin-dialog aria-label="simple"></vaadin-dialog>
            <web-navbar></web-navbar>
            <web-booking></web-booking>
        `;
    }
}
