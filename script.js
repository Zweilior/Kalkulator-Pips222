const $ = id => document.getElementById(id);
const output = $("output");

const toolSelect = $("toolSelect");
const pipForm = $("pipForm");
const riskForm = $("riskForm");

toolSelect.addEventListener("change", () => {
  const selected = toolSelect.value;
  [pipForm, riskForm].forEach(f => f.classList.add("hidden"));
  if (selected === "pip") pipForm.classList.remove("hidden");
  if (selected === "risk") riskForm.classList.remove("hidden");
  resetOutput();
});

function resetOutput() {
  output.innerHTML = `<div class="output-empty">Pilih kalkulator dan masukkan data untuk melihat hasil</div>`;
  output.classList.remove("has-content");
}

function showLoading() {
  output.innerHTML = `<div class="loading"></div>`;
  output.classList.add("has-content");
}

function displayResults(content) {
  output.innerHTML = content;
  output.classList.add("has-content");
}

pipForm.addEventListener("submit", e => {
  e.preventDefault();
  showLoading();

  setTimeout(() => {
    const entry = parseFloat($("entry").value);
    const tp = parseFloat($("tp").value);
    const sl = parseFloat($("sl").value);

    const pipTP = Math.abs(tp - entry) * 10;
    const pipSL = Math.abs(entry - sl) * 10;
    const direction = tp > entry ? "Buy" : "Sell";
    const rr = (pipTP / pipSL).toFixed(2);

    displayResults(`
      ${resultItem("Direction:", `<span class="result-value ${direction === "Buy" ? "direction-buy" : "direction-sell"}">${direction}</span>`)}
      ${resultItem("Pip to TP:", `${pipTP.toFixed(1)} pips`)}
      ${resultItem("Pip to SL:", `${pipSL.toFixed(1)} pips`)}
      ${resultItem("Risk/Reward:", `1:${rr}`)}
    `);
  }, 500);
});

riskForm.addEventListener("submit", e => {
  e.preventDefault();
  showLoading();

  setTimeout(() => {
    const balance = parseFloat($("balance").value);
    const riskPercent = parseFloat($("riskPercent").value);
    const slPips = parseFloat($("slRisk").value);
    const leverage = parseFloat($("leverage").value);

    const riskAmount = (riskPercent / 100) * balance;
    const calculatedLot = riskAmount / slPips;
    const suggestedLot = Math.max(0.01, Math.round(calculatedLot * 100) / 100);
    const actualRisk = suggestedLot * slPips;
    const actualRiskPercent = ((actualRisk / balance) * 100).toFixed(2);

    const leverageResults = [50, 100, 200, 500, 1000].map(lev => {
      const marginPerLot = (100 * balance) / lev;
      const maxLot = Math.max(0.01, Math.round((balance / marginPerLot * riskPercent / 100) * 100) / 100);
      return { lev, marginPerLot: marginPerLot.toFixed(2), maxLot: maxLot.toFixed(2) };
    });

    const leverageHTML = leverageResults.map(r =>
      `<div class="leverage-item"${r.lev == leverage ? ` style="background: rgba(255,215,0,0.1); border-color: #ffd700;"` : ''}>
        <span class="leverage-label">Leverage 1:${r.lev}</span>
        <span class="leverage-value">Max Lot: ${r.maxLot}</span>
      </div>`
    ).join("");

    const lotWarning = calculatedLot < 0.01 ? `
      <div class="result-item warning">
        <span class="result-label">⚠️ Peringatan Lot Size</span>
        <span class="result-value">
          Lot size ideal: <strong>${calculatedLot.toFixed(4)} lot</strong><br>
          Min lot Exness MT5: <strong>0.01 lot</strong><br>
          Menggunakan lot minimum.
        </span>
      </div>` : '';

    displayResults(`
      ${resultItem("Total Risiko:", `$${riskAmount.toFixed(2)}`)}
      ${resultItem("Saran Lot Size:", `${suggestedLot.toFixed(2)} lot XAU`)}
      ${lotWarning}
      ${resultItem("Risk Aktual:", `$${actualRisk.toFixed(2)} (${actualRiskPercent}%)`)}
      ${resultItem("Max Loss:", `${riskPercent.toFixed(1)}% dari modal (target)`)}
      ${resultItem("Balance After Loss:", `$${(balance - actualRisk).toFixed(2)}`)}
      ${resultItem("Leverage Dipilih:", `1:${leverage}`)}
      ${resultItem("📋 Info Broker:", `Exness MT5 - Min lot: 0.01`, "broker-info")}
      <div class="leverage-section">
        <div class="leverage-title">📊 Analisis Leverage</div>
        ${leverageHTML}
      </div>
    `);
  }, 500);
});

function resultItem(label, value, extraClass = "") {
  return `<div class="result-item ${extraClass}">
    <span class="result-label">${label}</span>
    <span class="result-value">${value}</span>
  </div>`;
}

// Init
resetOutput();
