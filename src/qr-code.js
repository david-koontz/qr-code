import { toCanvas } from "qrcode";

class QrCode extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: "open" });

        // create the canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute('part', 'canvas');
        this.shadowRoot.appendChild(this.canvas);

        // render the QR code to the canvas element
        this.updateQrCode();
    }

    static observedAttributes = ['background-color', 'content', 'error-correction-level', 'logo', 'margin', 'pixel-color', 'scale', 'width'];

    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'logo') {
            this.options = {
                color: {
                    light: this.attributes['background-color']?.value || '#ffffffff',
                    dark: this.attributes['pixel-color']?.value || '#000000ff',
                },
                errorCorrectionLevel: this.attributes['error-correction-level'] ? this.attributes['error-correction-level'].value : this.attributes['logo'] ? 'Q' : undefined,
                margin: this.attributes['margin']?.value,
                scale: this.attributes['scale']?.value,
                width: this.attributes['width']?.value
            };

            this.updateQrCode();
        }
    }

    /*
     * Updates the internal canvas element with a QR code
     */
    updateQrCode() {
        if (this.canvas) {
            // Call the "qrcode" toCanvas method to render the QR code itself
            toCanvas(this.canvas, this.attributes?.content?.value, this.options);

            // if there is a logo set, render that on top of the middle of the QR code
            if (this.attributes['logo']?.value) {
                const logoSize = 0.245;

                const logo = new Image();
                logo.src = this.attributes['logo']?.value;
                logo.crossOrigin = 'anonymous';
                logo.onload = () => {
                    const logoWidth = this.canvas.width * logoSize;
                    const logoPos = (this.canvas.width * (1 - logoSize)) / 2;

                    const canvasContext = this.canvas.getContext('2d');
                    if (canvasContext) {
                        canvasContext.fillStyle = this.attributes['background-color']?.value || '#ffffffff';
                        canvasContext.fillRect(logoPos, logoPos, logoWidth, logoWidth);
                        canvasContext.drawImage(logo, logoPos, logoPos, logoWidth, logoWidth)
                    }
                };
            }
        }
    }
}

customElements.define('qr-code', QrCode);