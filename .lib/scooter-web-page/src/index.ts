// @ts-nocheck
import "bootstrap";
import "./styles.scss";

import './components/root/web-root';
import './components/navbar/web-navbar';
import './components/booking/web-booking';
import './components/modal/web-modal';
import '@vaadin/vaadin-time-picker/vaadin-time-picker.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';

import { html, customElement, LitElement, internalProperty } from "lit-element";
const websocket = new WebSocket("ws://localhost:8090/");

websocket.onmessage = (event) => {
    if(event.data === "SUCCESS") {
        openDialog("Your booking was accepted later on by a Microservice! Wuhu! :)")
    } else if (event.data === "REJECTED") {
        openDialog("Your booking got declined later on by a Microservice! Oh no! Maybe you paid the wrong amount?")
    }
}

function openDialog(text: string) {
    customElements.whenDefined("vaadin-dialog").then(() => {
        const dialog = document.querySelector("vaadin-dialog");
    
        dialog.renderer = (root, dialog) => {
            // Check if there is a DOM generated with the previous renderer call to update its content instead of recreation
            if (root.firstElementChild) {
                return;
            }
            const webModal = window.document.createElement("web-modal");
            webModal.content = html`
                <h2>${text}</h2>
                <button @click=${() => {
                    dialog.opened = false;
                }} type="button" class="btn btn-success bezahlen">OK!</button>
            `;
    
            root.appendChild(webModal);
        };
    
        dialog.opened = true;
    });
}

