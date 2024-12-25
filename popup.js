const toggle = document.getElementById('toggle');
const statusText = document.getElementById('status');
const exchangeRateDisplay = document.getElementById('exchange-rate-display');

// Function to fetch the latest exchange rates from the API
async function fetchExchangeRates() {
  try {
    const response = await fetch('http://forex.cbm.gov.mm/api/latest');
    const data = await response.json();
    const rates = data.rates; // Get the exchange rates from the response

    if (rates) {
      chrome.storage.sync.set({ exchangeRates: rates }, () => {
        console.log('Exchange Rates:', rates);
        
        // Display exchange rate in the popup
        exchangeRateDisplay.textContent = `Exchange Rate (USD to MMK): 1 USD = ${rates.USD} MMK`;
      });
    } else {
      console.error("Exchange rates not found in the API response.");
      exchangeRateDisplay.textContent = "Error fetching rates.";
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    exchangeRateDisplay.textContent = "Error fetching rates.";
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
