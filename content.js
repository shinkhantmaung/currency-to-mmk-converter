// Array of currency objects
const currencies = [
    { symbol: '$', code: 'USD' },
    { symbol: '€', code: 'EUR' },
    { symbol: 'S$', code: 'SGD' },
    { symbol: '£', code: 'GBP' },
    { symbol: 'CHF', code: 'CHF' },
    { symbol: '¥', code: 'JPY' },
    { symbol: 'A$', code: 'AUD' },
    { symbol: '৳', code: 'BDT' },
    { symbol: 'B$', code: 'BND' },
    { symbol: '៛', code: 'KHR' },
    { symbol: 'C$', code: 'CAD' },
    { symbol: '¥', code: 'CNY' },
    { symbol: 'HK$', code: 'HKD' },
    { symbol: '₹', code: 'INR' },
    { symbol: 'Rp', code: 'IDR' },
    { symbol: '₩', code: 'KRW' },
    { symbol: '₭', code: 'LAK' },
    { symbol: 'RM', code: 'MYR' },
    { symbol: 'NZ$', code: 'NZD' },
    { symbol: '₨', code: 'PKR' },
    { symbol: '₱', code: 'PHP' },
    { symbol: '₨', code: 'LKR' },
    { symbol: '฿', code: 'THB' },
    { symbol: '₫', code: 'VND' },
    { symbol: 'R$', code: 'BRL' },
    { symbol: 'Kč', code: 'CZK' },
    { symbol: 'kr', code: 'DKK' },
    { symbol: '£', code: 'EGP' },
    { symbol: '₪', code: 'ILS' },
    { symbol: 'KSh', code: 'KES' },
    { symbol: 'د.ك', code: 'KWD' },
    { symbol: '₨', code: 'NPR' },
    { symbol: 'kr', code: 'NOK' },
    { symbol: '₽', code: 'RUB' },
    { symbol: 'ر.س', code: 'SAR' },
    { symbol: 'дин', code: 'RSD' },
    { symbol: 'R', code: 'ZAR' },
    { symbol: 'kr', code: 'SEK' },
    // Add other currencies here if needed
];

// Convert the array to an object for easier access
const currencySymbols = currencies.reduce((acc, { symbol, code }) => {
    acc[symbol] = code;
    return acc;
}, {});

// Function to get data from Chrome storage
const getFromStorage = (key, defaultValue) =>
    new Promise((resolve) => {
        chrome.storage.sync.get(key, (result) => resolve(result[key] ?? defaultValue));
    });

// Function to get exchange rates from storage
const getExchangeRates = () => getFromStorage('exchangeRates', {});

// Function to get whether the extension is enabled
const isExtensionEnabled = () => getFromStorage('isEnabled', true);

// Function to replace currency in text nodes
const replaceCurrency = (node, exchangeRates, currencySymbols, currencyRegex) => {
    if (node.nodeType === Node.TEXT_NODE) {
        const originalText = node.textContent;
        const updatedText = originalText.replace(currencyRegex, (match, symbol, amount) => {
            const currencyCode = currencySymbols[symbol];
            if (currencyCode && exchangeRates[currencyCode]) {
                const exchangeRate = exchangeRates[currencyCode];
                const convertedAmount = (parseFloat(amount) * exchangeRate).toFixed(2);
                return `${parseFloat(convertedAmount).toLocaleString()} MMK`;
            }
            return match; // If no conversion available, return as is
        });
        if (originalText !== updatedText) node.textContent = updatedText; // Update text only if it has changed
    }
};

// Function to show success message after conversion
const showSuccessMessage = (count) => {
    const message = document.createElement('div');
    message.textContent = `${count} currencies converted to MMK successfully!`;
    Object.assign(message.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        fontSize: '14px',
    });
    document.body.appendChild(message);
    setTimeout(() => document.body.removeChild(message), 3000); // Remove message after 3 seconds
};

// Function to convert currencies on the page
const convertCurrencies = async () => {
    if (!(await isExtensionEnabled())) return; // Do nothing if the extension is disabled

    const exchangeRates = await getExchangeRates();
    if (!Object.keys(exchangeRates).length) return; // Do nothing if exchange rates are not available

    const currencyRegex = new RegExp(
        `(${currencies.map(c => c.symbol.replace(/[$^.*+?()[\]{}|\\]/g, '\\$')).sort((a, b) => b.length - a.length).join('|')})(\\d+(?:\\.\\d{1,2})?)`,
        'g'
    );

    let conversionCount = 0;

    // Walk through the document body and replace all currencies
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        replaceCurrency(walker.currentNode, exchangeRates, currencySymbols, currencyRegex);
        conversionCount++;
    }

    if (conversionCount > 0) showSuccessMessage(conversionCount); // Show success message if currencies were converted

    console.log(`${conversionCount} currencies converted.`);
};

// Run the conversion when the page is ready
convertCurrencies();