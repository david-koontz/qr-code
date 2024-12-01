import { toCanvas } from "qrcode";

class QrCode extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: "open" });

        // create the canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.part = 'canvas';
        this.canvas.role = 'image';
        this.canvas.ariaLabel = `QR Code for "${this.attributes?.content?.value}"`;
        this.shadowRoot.appendChild(this.canvas);

        this.renderQrCode();
    }

    static observedAttributes = ['background-color', 'content', 'error-correction-level', 'logo', 'margin', 'pixel-color', 'scale', 'width'];

    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'logo') {
            this.renderQrCode();
        } else {
            this.renderLogo();
        }
    }

    /*
     * Updates the internal canvas element with a QR code
     */
    renderQrCode() {
        if (!this.canvas || !this.attributes?.content) {
            return;
        }

        const options = {
            color: {
                light: this.attributes['background-color']?.value || '#ffffffff',
                dark: this.attributes['pixel-color']?.value || '#000000ff',
            },
            errorCorrectionLevel: this.attributes['error-correction-level'] ? this.attributes['error-correction-level'].value : this.attributes['logo'] ? 'Q' : undefined,
            margin: this.attributes['margin']?.value,
            scale: this.attributes['scale']?.value,
            width: this.attributes['width']?.value
        };

        // Call the "qrcode" toCanvas method to render the QR code itself
        toCanvas(this.canvas, this.attributes.content?.value, options);

        // if there is a logo set, render that on top of the middle of the QR code
        if (this.attributes?.logo) {
            this.renderLogo();
        }
    }

    renderLogo() {
        if (!this.canvas || !this.attributes?.content || !this.attributes?.logo) {
            return;
        }

        const logo = new Image();
        logo.crossOrigin = '';
        logo.src = this.attributes['logo']?.value;
        logo.onload = () => {
            const canvasContext = this.canvas.getContext('2d');
            if (canvasContext) {
                const bgSize = 0.2433;
                const logoSize = 0.21;
                const bgWidth = this.canvas.width * bgSize;
                const bgPos = (this.canvas.width - bgWidth) / 2;
                const logoWidth = this.canvas.width * logoSize;
                const logoPos = (this.canvas.width - logoWidth) / 2;

                canvasContext.fillStyle = this.attributes['background-color']?.value || '#ffffffff';
                canvasContext.fillRect(bgPos, bgPos, bgWidth, bgWidth);
                canvasContext.drawImage(logo, logoPos, logoPos, logoWidth, logoWidth)
            }
        };
    }
}

customElements.define('qr-code', QrCode);