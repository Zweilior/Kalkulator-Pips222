const toolSelect = document.getElementById("toolSelect");
const pipForm = document.getElementById("pipForm");
const riskForm = document.getElementById("riskForm");
const output = document.getElementById("output");

// Event listener untuk pergantian tool
toolSelect.addEventListener("change", function() {
  const selected = this.value;
  pipForm.classList.add("hidden");
  riskForm.classList.add("hidden");

  if (selected === "pip") pipForm.classList.remove("hidden");
  if (selected === "risk") riskForm.classList.remove("hidden");

  resetOutput();
});

// Function untuk reset output
function resetOutput() {
  output.innerHTML = '<div class="output-empty">Pilih kalkulator dan masukkan data untuk melihat hasil</div>';
  output.classList.remove("has-content");
}

// Function untuk menampilkan loading
function showLoading() {
  output.innerHTML = '<div class="loading"></div>';
  output.classList.add("has-content");
}

// Function untuk menampilkan hasil
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

    // Perhitungan pip untuk emas (1 pip = 0.1)
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

// Kalkulator Risk dengan Leverage
riskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  showLoading();

  setTimeout(() => {
    const balance = parseFloat(document.getElementById("balance").value);
    const riskPercent = parseFloat(document.getElementById("riskPercent").value);
    const slPips = parseFloat(document.getElementById("slRisk").value);
    const leverage = parseFloat(document.getElementById("leverage").value);

    // Perhitungan risk management
    const riskAmount = (riskPercent / 100) * balance;
    
    // Perhitungan lot size dengan penyesuaian Exness MT5
    const calculatedLotSize = riskAmount / (slPips * 1); // Asumsi 1 pip = $1 untuk 1 lot XAU
    
    // Minimum lot size untuk Exness MT5 adalah 0.01 lot
    const minimumLot = 0.01;
    const suggestedLot = Math.max(minimumLot, Math.round(calculatedLotSize * 100) / 100);
    
    const maxLoss = riskPercent.toFixed(1);

    // Perhitungan leverage - contract size XAU biasanya 100 oz
    const contractSize = 100; // 100 oz per lot
    const leverageResults = [50, 100, 200, 500, 1000].map(lev => {
      // Margin required untuk 1 lot dengan leverage tertentu
      const marginPerLot = (contractSize * balance) / lev;
      // Maximum lot yang bisa dibuka dengan balance yang ada
      const maxLot = Math.max(minimumLot, Math.round(((balance / marginPerLot) * (riskPercent / 100)) * 100) / 100);
      return {
        leverage: lev,
        marginRequired: marginPerLot.toFixed(2),
        maxLot: maxLot.toFixed(2)
      };
    });

    // Membuat section leverage analysis
    let leverageSection = `
      <div class="leverage-section">
        <div class="leverage-title">📊 Analisis Leverage</div>
    `;

    leverageResults.forEach(result => {
      const isSelected = result.leverage == leverage ? ' style="background: rgba(255, 215, 0, 0.1); border-color: #ffd700;"' : '';
      leverageSection += `
        <div class="leverage-item"${isSelected}>
          <span class="leverage-label">Leverage 1:${result.leverage}</span>
          <span class="leverage-value">Max Lot: ${result.maxLot}</span>
        </div>
      `;
    });

    leverageSection += '</div>';

    // Peringatan jika lot size terlalu kecil
    let lotWarning = '';
    if (calculatedLotSize < minimumLot) {
      lotWarning = `
        <div class="result-item warning">
          <span class="result-label">⚠️ Peringatan Lot Size</span>
          <span class="result-value">
            Lot size ideal berdasarkan risk management: <strong>${calculatedLotSize.toFixed(4)} lot</strong><br>
            Minimum lot size Exness MT5: <strong>${minimumLot} lot</strong><br>
            Menggunakan lot minimum untuk trading ini.
          </span>
        </div>
      `;
    }

    // Perhitungan risk aktual dengan lot yang disesuaikan
    const actualRiskAmount = suggestedLot * slPips * 1;
    const actualRiskPercent = (actualRiskAmount / balance * 100).toFixed(2);

    // Hasil utama
    const content = `
      <div class="result-item">
        <span class="result-label">Total Risiko:</span>
        <span class="result-value">$${riskAmount.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Saran Lot Size:</span>
        <span class="result-value">${suggestedLot.toFixed(2)} lot XAU</span>
      </div>
      ${lotWarning}
      <div class="result-item">
        <span class="result-label">Risk Aktual:</span>
        <span class="result-value">$${actualRiskAmount.toFixed(2)} (${actualRiskPercent}%)</span>
      </div>
      <div class="result-item">
        <span class="result-label">Max Loss:</span>
        <span class="result-value">${maxLoss}% dari modal (target)</span>
      </div>
      <div class="result-item">
        <span class="result-label">Balance After Loss:</span>
        <span class="result-value">$${(balance - actualRiskAmount).toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Leverage Dipilih:</span>
        <span class="result-value">1:${leverage}</span>
      </div>
      <div class="result-item broker-info">
        <span class="result-label">📋 Info Broker:</span>
        <span class="result-value">Exness MT5 - Min lot: 0.01</span>
      </div>
      ${leverageSection}
    `;

    displayResults(content);
  }, 500);
});

// Initialize aplikasi
resetOutput();