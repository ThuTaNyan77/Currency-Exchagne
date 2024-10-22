const dropList = document.querySelectorAll("form select"),
      fromCurrency = document.getElementById("from-currency"),
      toCurrency = document.getElementById("to-currency"),
      getButton = document.getElementById("get-rate"),
      fromFlag = document.getElementById("from-flag"),
      toFlag = document.getElementById("to-flag");

// Populate the dropdowns with currency options
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        // Selecting USD by default as FROM currency and AFN as TO currency
        let selected = i === 0 ? (currency_code === "USD" ? "selected" : "") : (currency_code === "AFN" ? "selected" : "");

        // Creating option tag with both flag emoji and currency code
        let optionTag = `<option value="${currency_code}" ${selected}> 
                            ${country_list[currency_code].flag} ${currency_code}
                        </option>`;
        
        // Inserting option tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }

    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); // Call loadFlag with target element
    });
}

// Function to load the flag based on selected currency
function loadFlag(element) {
    const selectedCode = element.value;

    // Update the image source based on the selected currency code
    if (element === fromCurrency) {
        fromFlag.src = `https://flagcdn.com/48x36/${country_list[selectedCode].code.toLowerCase()}.png`;
    } else if (element === toCurrency) {
        toFlag.src = `https://flagcdn.com/48x36/${country_list[selectedCode].code.toLowerCase()}.png`;
    }
}

// Function to get the exchange rate
function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;

    // Default amount value if user input is invalid
    if (amountVal === "" || amountVal === "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/119c7dbb0b6f4a3176a6c474/latest/${fromCurrency.value}`;

    // Fetching the exchange rate from the API
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value]; // Getting TO currency rate
            let totalExRate = (amountVal * exchangeRate).toFixed(2); // Calculating total exchange rate
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Something went wrong"; // Error handling
        });
}

// Load the exchange rate on window load
window.addEventListener("load", () => {
    getExchangeRate();
});

// Event listener for the "Get Exchange Rate" button
getButton.addEventListener("click", e => {
    e.preventDefault(); // Preventing form submission
    getExchangeRate();
});

// Swapping the currencies
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value; // Temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // Set FROM currency to TO currency
    toCurrency.value = tempCode; // Set TO currency to the original FROM currency
    loadFlag(fromCurrency); // Call loadFlag with FROM select element
    loadFlag(toCurrency); // Call loadFlag with TO select element
});
