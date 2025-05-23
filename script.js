const container = document.getElementById("calculatorContainer");
const selector = document.getElementById("calculatorSelector");

selector.addEventListener("change", loadCalculator);

// Load default calculator
window.onload = () => loadCalculator();

function loadCalculator() {
  const selected = selector.value;

  if (selected === "pl") {
    container.innerHTML = `
      <h3>Profit / Loss Calculator</h3>
      <input type="number" id="entryPrice" placeholder="Entry Price">
      <input type="number" id="exitPrice" placeholder="Exit Price">
      <input type="number" id="lotSize" placeholder="Lot Size (in units)">
      <button onclick="calculatePL()">Calculate</button>
      <div class="result" id="plResult"></div>
    `;
  } else if (selected === "position") {
    container.innerHTML = `
      <h3>Position Size Calculator</h3>
      <input type="number" id="accountBalance" placeholder="Account Balance">
      <input type="number" id="riskPercent" placeholder="Risk per Trade (%)">
      <input type="number" id="stopLoss" placeholder="Stop Loss (pips)">
      <button onclick="calculatePositionSize()">Calculate</button>
      <div class="result" id="positionResult"></div>
    `;
  } else if (selected === "rrr") {
    container.innerHTML = `
      <h3>Risk / Reward Ratio Calculator</h3>
      <input type="number" id="entry" placeholder="Entry Price">
      <input type="number" id="stop" placeholder="Stop Loss Price">
      <input type="number" id="target" placeholder="Take Profit Price">
      <button onclick="calculateRRR()">Calculate</button>
      <div class="result" id="rrrResult"></div>
    `;
  }
}

function calculatePL() {
  const entry = parseFloat(document.getElementById("entryPrice").value);
  const exit = parseFloat(document.getElementById("exitPrice").value);
  const lot = parseFloat(document.getElementById("lotSize").value);

  const pipValue = 0.0001; // contoh pip value
  const pips = (exit - entry) / pipValue;
  const result = pips * lot;

  document.getElementById("plResult").innerText = `P/L: ${result.toFixed(2)} USD`;
}

function calculatePositionSize() {
  const balance = parseFloat(document.getElementById("accountBalance").value);
  const riskPercent = parseFloat(document.getElementById("riskPercent").value);
  const stopLoss = parseFloat(document.getElementById("stopLoss").value);

  const riskAmount = balance * (riskPercent / 100);
  const pipValue = 0.0001; // bisa disesuaikan
  const positionSize = riskAmount / (stopLoss * pipValue);

  document.getElementById("positionResult").innerText = `Position Size: ${positionSize.toFixed(2)} units`;
}

function calculateRRR() {
  const entry = parseFloat(document.getElementById("entry").value);
  const stop = parseFloat(document.getElementById("stop").value);
  const target = parseFloat(document.getElementById("target").value);

  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const ratio = reward / risk;

  document.getElementById("rrrResult").innerText = `RRR: ${ratio.toFixed(2)}:1`;
}
