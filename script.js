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

  output.innerHTML = "";
});

// Kalkulator Pip
pipForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const entry = parseFloat(document.getElementById("entry").value);
  const tp = parseFloat(document.getElementById("tp").value);
  const sl = parseFloat(document.getElementById("sl").value);

  const pipTP = Math.abs(tp - entry) * 10;
  const pipSL = Math.abs(entry - sl) * 10;
  const direction = tp > entry ? "Buy" : "Sell";

  output.innerHTML = `
    <strong>Direction:</strong> ${direction}<br/>
    <strong>Pip to TP:</strong> ${pipTP.toFixed(1)} pips<br/>
    <strong>Pip to SL:</strong> ${pipSL.toFixed(1)} pips
  `;
});

// Kalkulator Risk
riskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const balance = parseFloat(document.getElementById("balance").value);
  const riskPercent = parseFloat(document.getElementById("riskPercent").value);
  const slPips = parseFloat(document.getElementById("slRisk").value);

  const riskAmount = (riskPercent / 100) * balance;
  const lotSize = riskAmount / (slPips * 1); // Asumsi 1 pip = $1 untuk 1 lot XAU

  output.innerHTML = `
    <strong>Total Risiko:</strong> $${riskAmount.toFixed(2)}<br/>
    <strong>Saran Lot Size:</strong> ${lotSize.toFixed(2)} lot XAU
  `;
});
