const toggle = document.getElementById('toggle');
const statusText = document.getElementById('status');
const rateDisplays = {
    USD: document.getElementById('usd-rate'),
    EUR: document.getElementById('eur-rate'),
    JPY: document.getElementById('jpy-rate'),
    THB: document.getElementById('thb-rate'),
    SGD: document.getElementById('sgd-rate'),
    CNY: document.getElementById('cny-rate'),
};

// Function to fetch and display the latest exchange rates
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://forex.cbm.gov.mm/api/latest');
        const { rates } = await response.json();

        if (rates) {
            chrome.storage.sync.set({ exchangeRates: rates }, () => {
                console.log('Exchange Rates:', rates);
                for (const [currency, rate] of Object.entries(rates)) {
                    if (rateDisplays[currency]) {
                        rateDisplays[currency].textContent = `1 ${currency} = ${rate} MMK`;
                    }
                }
            });
        } else {
            displayError("Exchange rates not found in the API response.");
        }
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        displayError("Error fetching rates.");
    }
}

// Display error message for all rate displays
function displayError(message) {
    for (const display of Object.values(rateDisplays)) {
        display.textContent = message;
    }
}

// Update status text in the popup
function updateStatusText(isEnabled) {
    statusText.innerHTML = `Extension is <strong>${isEnabled ? 'ON' : 'OFF'}</strong>`;
}

// Load settings and update the exchange rates
chrome.storage.sync.get(['isEnabled'], ({ isEnabled = true }) => {
    toggle.checked = isEnabled;
    updateStatusText(isEnabled);
    fetchExchangeRates();
});

// Save the toggle state
toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ isEnabled }, () => {
        updateStatusText(isEnabled);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) chrome.tabs.reload(tabs[0].id);
        });
    });
});