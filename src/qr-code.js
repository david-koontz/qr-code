import { toCanvas } from "qrcode";

class QrCode extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: "open" });

        const canvas = document.createElement("canvas");
        canvas.setAttribute('part', 'canvas');
        this.shadowRoot.appendChild(canvas);
        this.updateQrCode();
    }

    static observedAttributes = ['content', 'background-color', 'pixel-color', 'error-correction-level', 'scale', 'width'];

    attributeChangedCallback(name, oldValue, newValue) {
        this.options = {
            color: {
                light: this.attributes['background-color']?.value || '#ffffffff',
                dark: this.attributes['pixel-color']?.value || '#000000ff',
            },
            scale: this.attributes['scale']?.value,
            width: this.attributes['width']?.value
        };

        this.updateQrCode();
    }

    updateQrCode() {
        let canvas;
        if (canvas = this.shadowRoot?.querySelector('canvas')) {
            toCanvas(canvas, this.attributes?.content?.value, this.options);
        }
    }
}

customElements.define('qr-code', QrCode);