// @ts-nocheck
import { html, customElement, LitElement, internalProperty } from "lit-element";
import { NoShadowMixin } from "../../packages/page-mixin";

import "./web-booking.scss";
import { HttpClient } from "../../packages/http-client";
const json = require('../../../../database/scooters.json');

@customElement("web-booking")
export class WebBooking extends NoShadowMixin(LitElement) {
    @internalProperty() scooters = json.scooters;

    @internalProperty() activeScooter = this.scooters[0];
    @internalProperty() time = "00:00"
    @internalProperty() payedValue = 0;
    @internalProperty() email = "";

    render() {
        return html`
            ${this.renderScooterSelect()} ${this.renderMailInput()} ${this.renderTimeInput()}
            <button @click=${this.pay} type="button" class="btn btn-success bezahlen">Jetzt bezahlen!</button>
        `;
    }

    renderScooterSelect() {
        return html`
            <h1>Wählen Sie einen Scooter!</h1>
            <div class="scooter-carousel">
                ${this.scooters.map((scooter) => {
                    return html`
                        <div
                            @click=${() => this.clickScooter(scooter)}
                            id="scooter_${scooter.id}"
                            class="card scooter ${this.activeScooter === scooter ? "active" : ""}"
                            style="width: 18rem;"
                        >
                            <img class="card-img-top" src="${scooter.image}" alt="${scooter.name}" />
                            <div class="card-body">
                                <h5 class="card-title">${scooter.name}</h5>
                                <p class="card-text">${scooter.description}.</p>
                            </div>
                        </div>
                    `;
                })}
            </div>
            <br />
        `;
    }

    clickScooter(scooter: any) {
        this.activeScooter = scooter;
    }

    renderMailInput() {
        return html`
            <h1>Geben Sie bitte Ihre Mail-Adresse an!</h1>
            <input type="text" class="form-control" value=${this.email} @input=${this.changeEmail} aria-label="mail" />
            <br />
        `;
    }

    changeEmail(event) {
        this.email = event.target.value;
    }

    renderTimeInput() {
        return html`
            <h1>Wie lange möchten Sie den Scooter buchen?</h1>
            <vaadin-time-picker id="timePicker" value="${this.time}"></vaadin-time-picker>
        `;
    }

    firstUpdated() {
        document.getElementById("timePicker").addEventListener("value-changed", (event: CustomEvent) => {
            this.time = event.detail.value;
        })
    }

    pay() {
        customElements.whenDefined("vaadin-dialog").then(() => {
            const dialog = document.querySelector("vaadin-dialog");

            dialog.renderer = (root, dialog) => {
                // Check if there is a DOM generated with the previous renderer call to update its content instead of recreation
                if (root.firstElementChild) {
                    return;
                }
                const webModal = window.document.createElement("web-modal");
                webModal.content = html`
                    <h1>Bitte bezahlen Sie!</h1>
                    <div>Kosten: ${(parseInt(this.time.split(":")[0]) * 60 + parseInt(this.time.split(":")[1])) * this.activeScooter.costperMinute}</div>
                    <input type="number" value="${this.payedValue}" @input="${(event) => this.changePayedValue(event)}" class="form-control" aria-label="money" />
                    <br>
                    <button @click=${() => this.transfer(dialog)} type="button" class="btn btn-success bezahlen">OK!</button>
                `;

                root.appendChild(webModal);
            };

            dialog.opened = true;
        });
    }

    changePayedValue(event) {
        this.payedValue = parseInt(event.target.value);
    }

    transfer(dialog) {
        const payload = {
            scooterId: this.activeScooter.id,
            costPerMinute: this.activeScooter.costperMinute,
            payedValue: this.payedValue,
            email: this.email,
            bookedTime: this.time
        };
        new HttpClient({baseURL: "http://localhost:8090"}).post("/book", payload).then(() => {
            console.log("REQUEST SEND:");
            console.log(payload);
            dialog.opened = false;
        })
    }
}
