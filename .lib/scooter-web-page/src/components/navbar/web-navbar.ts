import { html, customElement, LitElement } from "lit-element";
import { NoShadowMixin } from "../../packages/page-mixin";

@customElement("web-navbar")
export class WebNavbar extends NoShadowMixin(LitElement) {
    render() {
        return html`
            <nav class="navbar navbar-light bg-light">
                <a class="navbar-brand" href="#">
                    <img src="https://www.fh-muenster.de/common/hochschulkatalog/includes/lib/img/fh-muenster-logo.svg" alt="" />
                </a>
                <span class="navbar-text">Scooter-Booking with Zeebe</span>
            </nav>
        `;
    }
}
