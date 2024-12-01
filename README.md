# `qr-code`

Web component to display given content as a QR code, leveraging the [`qrcode`](https://www.npmjs.com/package/qrcode) package to render to an internal canvas element.

## Examples

[Demo site](https://david-koontz.github.io/qr-code/) with a few examples.

The `content` attribute is the only required attribute in order to render the QR code:

```html
<script type="module" src="qr-code.js"></script>

<qr-code content="https://developer.mozilla.org/docs/Web/API/Web_components"></qr-code>
```

However there are many other supplemental options to customize the QR code:
```html
<script type="module" src="qr-code.js"></script>

<qr-code
  background-color="#ebeaea"
  content="https://vite.dev/guide/"
  logo="https://vite.dev/logo.svg"
  pixel-color="#8400d9"
  scale="8"
></qr-code>
```

## API

Many attributes are just exposing controls over the underlying options for [`qrcode`](https://www.npmjs.com/package/qrcode#renderers-options) to render the QR code.

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | String | | **Required**. String (usually a URL) to render as a QR code. |
| `logo` | String | | URL to an image to optionally display in the center of the QR code, for branding purposes or otherwise. |
| `background-color` | String | `#ffffffff` | Color for the background behind the pixel dots.<br/> Value must be a valid hex format.
| `pixel-color` | String | `#000000ff` | Color for the pixel dots.<br/> Value must be a valid hex format.
| `error-correction-level` | `low`, `medium`, `quartile`, `high` or `L`, `M`, `Q`, `H` | `M` | Higher levels offer a better error resistance but reduce the symbol's capacity. See `qrcode`'s [Error Correction Level](https://www.npmjs.com/package/qrcode#error-correction-level) for more.<br/> When a `logo` is provided, the default increases to `Q` for better accuracy. |
| `margin` | Number | 4 | How much wide the "quiet zone" rendered around the QR code should be. |
| `scale` | Number | 4 | Scale factor. A value of "1" means "1px per module". |
| `width` | Number | | Forces a specific width for the output image.<br/> If `width` is too small to contain the QR code, this option will be ignored.<br/> Takes precedence over `scale`. |

## Usage

**Option 1**: Install from npm

```sh
npm install @david-koontz/qr-code
```

From there you can either move/automate the included `dist/qr-code.js` file to where you need and can access it, or import it into your application directly:

```js
import('@david-koontz/qr-code');
```

---

**Option 2**: The prebuilt `qr-code.js` file is included for ease of use as well.

Download from https://github.com/david-koontz/qr-code/tree/main/qr-code.js and enjoy.