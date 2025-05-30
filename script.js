const toolSelect = document.getElementById("toolSelect");
const pipForm = document.getElementById("pipForm");
const riskForm = document.getElementById("riskForm");
const output = document.getElementById("output");

toolSelect.addEventListener("change", function() {
  const selected = this.value;
  pipForm.classList.add("hidden");
  riskForm.classList.add("hidden");

  if (selected === "pip") pipForm.classList.remove("hidden");
  if (selected === "risk") riskForm.classList.remove("hidden");

  resetOutput();
});

function resetOutput() {
  output.innerHTML = '<div class="output-empty">Pilih kalkulator dan masukkan data untuk melihat hasil</div>';
  output.classList.remove("has-content");
}

function showLoading() {
  output.innerHTML = '<div class="loading"></div>';
  output.classList.add("has-content");
}

function displayResults(content) {
  output.innerHTML = content;
  output.classList.add("has-content");
}

// Kalkulator Pip
pipForm.addEventListener("submit", function(e) {
  e.preventDefault();
  showLoading();

  setTimeout(() => {
    const entry = parseFloat(document.getElementById("entry").value);
    const tp = parseFloat(document.getElementById("tp").value);
    const sl = parseFloat(document.getElementById("sl").value);

    const pipTP = Math.abs(tp - entry) * 10;
    const pipSL = Math.abs(entry - sl) * 10;
    const direction = tp > entry ? "Buy" : "Sell";
    const directionClass = direction === "Buy" ? "direction-buy" : "direction-sell";
    const riskReward = (pipTP / pipSL).toFixed(2);

    const content = `
      <div class="result-item">
        <span class="result-label">Direction:</span>
        <span class="result-value ${directionClass}">${direction}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Pip to TP:</span>
        <span class="result-value">${pipTP.toFixed(1)} pips</span>
      </div>
      <div class="result-item">
        <span class="result-label">Pip to SL:</span>
        <span class="result-value">${pipSL.toFixed(1)} pips</span>
      </div>
      <div class="result-item">
        <span class="result-label">Risk/Reward:</span>
        <span class="result-value">1:${riskReward}</span>
      </div>
    `;

    displayResults(content);
  }, 500);
});

// Kalkulator Risk
riskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  showLoading();

  setTimeout(() => {
    const balance = parseFloat(document.getElementById("balance").value);
    const riskPercent = parseFloat(document.getElementById("riskPercent").value);
    const slPips = parseFloat(document.getElementById("slRisk").value);

    const riskAmount = (riskPercent / 100) * balance;
    const lotSize = riskAmount / (slPips * 1); // Asumsi 1 pip = $1 untuk 1 lot XAU
    const maxLoss = (riskPercent).toFixed(1);

    const content = `
      <div class="result-item">
        <span class="result-label">Total Risiko:</span>
        <span class="result-value">${riskAmount.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Saran Lot Size:</span>
        <span class="result-value">${lotSize.toFixed(2)} lot XAU</span>
      </div>
      <div class="result-item">
        <span class="result-label">Max Loss:</span>
        <span class="result-value">${maxLoss}% dari modal</span>
      </div>
      <div class="result-item">
        <span class="result-label">Balance After Loss:</span>
        <span class="result-value">${(balance - riskAmount).toFixed(2)}</span>
      </div>
    `;

    displayResults(content);
  }, 500);
});

// Initialize
resetOutput();