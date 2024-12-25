const toggle = document.getElementById('toggle');
const statusText = document.getElementById('status');
const usdRateDisplay = document.getElementById('usd-rate');
const eurRateDisplay = document.getElementById('eur-rate');
const jpyRateDisplay = document.getElementById('jpy-rate');

// Function to fetch the latest exchange rates from the API
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://forex.cbm.gov.mm/api/latest');
        const data = await response.json();
        const rates = data.rates; // Get the exchange rates from the response

        if (rates) {
            chrome.storage.sync.set({ exchangeRates: rates }, () => {
                console.log('Exchange Rates:', rates);

                // Display exchange rates in the popup
                usdRateDisplay.textContent = `1 USD = ${rates.USD} MMK`;
                eurRateDisplay.textContent = `1 EUR = ${rates.EUR} MMK`;
                jpyRateDisplay.textContent = `1 JPY = ${rates.JPY} MMK`;
            });
        } else {
            console.error("Exchange rates not found in the API response.");
            usdRateDisplay.textContent = "Error fetching rates.";
            eurRateDisplay.textContent = "Error fetching rates.";
            jpyRateDisplay.textContent = "Error fetching rates.";
        }
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        usdRateDisplay.textContent = "Error fetching rates.";
        eurRateDisplay.textContent = "Error fetching rates.";
        jpyRateDisplay.textContent = "Error fetching rates.";
    }
}

// Load settings and update the exchange rates
chrome.storage.sync.get(['isEnabled'], (result) => {
    const isEnabled = result.isEnabled ?? true;
    toggle.checked = isEnabled;
    updateStatusText(isEnabled);

    // Fetch and display the latest exchange rates
    fetchExchangeRates();
});

// Update status text in the popup
function updateStatusText(isEnabled) {
    statusText.innerHTML = `Extension is <strong>${isEnabled ? 'ON' : 'OFF'}</strong>`;
}

// Save the toggle state
toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ isEnabled }, () => {
        updateStatusText(isEnabled);

        // Reload the current page to reflect the updated state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    });
});