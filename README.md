# Currency to MMK Converter

Currency to MMK Converter is a browser extension that converts various currencies to Myanmar Kyat (MMK) on web pages using exchange rates from the Central Bank of Myanmar.

## Features

- Automatically convert prices from multiple currencies to MMK.
- Supports a wide range of currencies including USD, EUR, JPY, SGD, THB, and CNY.
- Fetches the latest exchange rates from the [Central Bank of Myanmar API](https://forex.cbm.gov.mm/index.php/api).
- Easy to enable/disable via a toggle switch.

## Installation

### Prerequisites

- Google Chrome browser

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/shinkhantmaung/currency-to-mmk-converter.git
    ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the cloned repository folder.

## Usage

1. Once the extension is installed, click on the extension icon in the browser toolbar.
2. Toggle the switch to enable or disable the extension.
3. The extension will automatically convert currency amounts on web pages to MMK based on the latest exchange rates.

### Supported Currencies

- USD (United States Dollar)
- EUR (Euro)
- JPY (Japanese Yen)
- SGD (Singapore Dollar)
- THB (Thai Baht)
- CNY (Chinese Yuan)

## Development

### Fetching Exchange Rates

The extension fetches exchange rates from the [Central Bank of Myanmar API](https://forex.cbm.gov.mm/index.php/api). The rates are stored in Chrome's sync storage and updated regularly.

### File Structure

- `index.html` : The popup interface for enabling/disabling the extension and displaying exchange rates.
- `styles.css` : CSS for styling the popup interface.
- `popup.js` : JavaScript for handling the popup interface logic.
- `content.js` : JavaScript for converting currencies on web pages.
- `manifest.json` : Configuration file for the Chrome extension.

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes and commit them (git commit -m 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.