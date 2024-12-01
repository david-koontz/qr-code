import { toCanvas } from "qrcode";

class QrCode extends HTMLElement {
    constructor() {
        super();
      
        this.attachShadow({ mode: "open" });
      
        // create the initial canvas element
        this.createCanvas();

        const style = document.createElement("style");
        style.textContent = ':host(:not([content])){display:none;}';
        this.shadowRoot.appendChild(style);
    }

    connectedCallback() {
        this.renderQrCode();
    }

    static observedAttributes = ['background-color', 'content', 'error-correction-level', 'logo', 'margin', 'pixel-color', 'scale', 'width'];

    attributeChangedCallback(name, oldValue, newValue) {
        // Whenever an attribute changes, we want to re-draw the canvas to reflect changes
        if (name === 'logo') {
            this.renderLogo();
        } else {
            this.renderQrCode();
        }
    }

    /**
     * Draws the configured "content" as a QR code to the internal canvas element
     */
    renderQrCode() {
        if (!this.canvas) {
            return;
        }
        if (!this.attributes?.content) {
            return this.createCanvas();
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
        toCanvas(this.canvas, this.attributes.content.value, options);

        // update the canvas' a11y now that it is rendered
        this.canvas.role = 'image';
        this.canvas.ariaLabel = `QR Code for "${this.attributes.content.value}"`;

        // if there is a logo, render that on top of the middle of the QR code
        if (this.attributes.logo) {
            this.renderLogo();
        }
    }

    /**
     * Draws the provided "logo" image superimposed over the QR code
     */
    renderLogo() {
        if (!this.canvas || !this.attributes?.content) {
            return;
        }
        if (!this.attributes?.logo) {
            return this.renderQrCode();
        }

        const logo = new Image();
        logo.crossOrigin = '';
        logo.src = this.attributes['logo'].value;
        logo.onload = () => {
            const canvasContext = this.canvas.getContext('2d');
            if (canvasContext) {
                const bgSize = 0.24333;
                const bgWidth = this.canvas.width * bgSize;
                const bgPos = (this.canvas.width - bgWidth) / 2;
                const logoWidth = this.canvas.width * bgSize * 0.85;
                const logoPos = (this.canvas.width - logoWidth) / 2;

                canvasContext.fillStyle = this.attributes['background-color']?.value || '#ffffffff';
                canvasContext.fillRect(bgPos, bgPos, bgWidth, bgWidth);
                canvasContext.drawImage(logo, logoPos, logoPos, logoWidth, logoWidth)
            }
        };
    }

    /**
     * Creates (or re-creates) the canvas element on which the QR code will be rendered
     */
    createCanvas() {
        if (this.canvas) {
            this.canvas.remove();
        }

        this.canvas = document.createElement("canvas");
        this.canvas.part = 'canvas';
        this.shadowRoot.appendChild(this.canvas);
    }
}

customElements.define('qr-code', QrCode);