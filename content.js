async function getExchangeRates() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('exchangeRates', (result) => {
            const exchangeRates = result.exchangeRates;
            if (exchangeRates) {
                resolve(exchangeRates);
            } else {
                console.error("Exchange rates not found in storage.");
                resolve({});  // Return empty object if no rates are found
            }
        });
    });
}

// Function to get whether the extension is enabled
async function isExtensionEnabled() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('isEnabled', (result) => {
            const isEnabled = result.isEnabled ?? true;
            resolve(isEnabled);
        });
    });
}


async function convertCurrencies() {
    // Check if extension is enabled
    const isEnabled = await isExtensionEnabled();
    if (!isEnabled) return; // Do nothing if the extension is disabled

    const exchangeRates = await getExchangeRates();  // Fetch exchange rates from storage
    if (!exchangeRates) return; // Do nothing if exchange rates are not available

    // Define currency symbols and their corresponding currency codes
    const currencySymbols = {
        '$': 'USD',
        '€': 'EUR',
        '฿': 'THB',
        '¥': 'JPY',
        '£': 'GBP',
        '₹': 'INR',
        // Add other currency symbols if needed
    };

    const currencyRegex = /([€$฿¥£₹])(\d+(?:\.\d{1,2})?)/g;  // Regex to detect currency symbols followed by amount

    let conversionCount = 0;

    // Replace currency in the text nodes
    function replaceCurrency(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent;
            const updatedText = originalText.replace(currencyRegex, (_, symbol, amount) => {
                conversionCount++;

                // Check if the symbol is in the currencySymbols
                const currencyCode = currencySymbols[symbol];
                if (currencyCode && exchangeRates[currencyCode]) {
                    const exchangeRate = exchangeRates[currencyCode];
                    // Convert the amount to MMK
                    const convertedAmount = (parseFloat(amount) * exchangeRate).toFixed(2);
                    return `${convertedAmount.toLocaleString()} MMK`;
                }

                return `${symbol}${amount}`;  // If no conversion available, return as is
            });

            // Only update text if it has been changed
            if (originalText !== updatedText) {
                node.textContent = updatedText;
            }
        }
    }

    // Walk through the document body and replace all currencies
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        replaceCurrency(node);
    }

    // Show success message if currencies were converted
    if (conversionCount > 0) {
        showSuccessMessage(conversionCount);
    }

    console.log(`${conversionCount} currencies converted.`);
}

// Show success message after conversion
function showSuccessMessage(count) {
    const message = document.createElement('div');
    message.textContent = `${count} currencies converted to MMK successfully!`;
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.right = '20px';
    message.style.backgroundColor = '#007BFF';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    message.style.zIndex = '10000';
    message.style.fontSize = '14px';

    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}

// Run the conversion when the page is ready
convertCurrencies();
