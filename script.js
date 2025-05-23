function hitungPip() {
  const entry = parseFloat(document.getElementById("entry").value);
  const exit = parseFloat(document.getElementById("exit").value);
  const lot = parseFloat(document.getElementById("lot").value);
  const sl = parseFloat(document.getElementById("sl").value);
  const tp = parseFloat(document.getElementById("tp").value);
  const balance = parseFloat(document.getElementById("balance").value);
  const risk = parseFloat(document.getElementById("risk").value);
  const leverage = parseInt(document.getElementById("leverage").value);
  
  if (isNaN(entry) || isNaN(exit) || isNaN(lot) || isNaN(balance) || isNaN(risk)) {
    document.getElementById("result").innerHTML = "Masukkan semua nilai dengan benar.";
    return;
  }

  // Perhitungan pip
  const selisihPip = Math.abs(exit - entry) / 0.01;
  const pipValuePerLot = 10; // 1 lot = $10 per pip
  const totalUSD = selisihPip * pipValuePerLot * lot;

  // Perhitungan SL/TP pip
  const slPip = sl ? Math.abs(sl - entry) / 0.01 : 0;
  const tpPip = tp ? Math.abs(tp - entry) / 0.01 : 0;

  // Kalkulator Risiko (Risk-to-Reward Ratio)
  const riskAmount = (risk / 100) * balance; // Risiko dalam USD
  const slValue = slPip * pipValuePerLot * lot;
  const riskRewardRatio = slValue ? (tpPip / slPip).toFixed(2) : 0;

  // Kalkulator Margin Level
  const marginRequired = (entry * 100) / leverage; // Margin required = entry price * lot size / leverage
  const marginLevel = (balance / marginRequired) * 100;

  // Kalkulator Trade Size Berdasarkan Risiko
  const tradeSize = (riskAmount / (slPip * pipValuePerLot)) * 0.01; // Ukuran lot berdasarkan risiko

  document.getElementById("result").style.display = 'block';
  document.getElementById("result").innerHTML = `
    <h3>Hasil Perhitungan Pip</h3>
    Selisih: ${selisihPip.toFixed(1)} pip<br/>
    Potensi Profit/Loss: $${totalUSD.toFixed(2)}<br/>
    Stop Loss (SL): ${slPip.toFixed(1)} pip<br/>
    Take Profit (TP): ${tpPip.toFixed(1)} pip<br/>
    Risiko ($): $${riskAmount.toFixed(2)}<br/>
    Rasio Risiko-Reward: ${riskRewardRatio} (TP/SL)<br/>
    Margin Level: ${marginLevel.toFixed(2)}%<br/>
    Ukuran Lot Berdasarkan Risiko: ${tradeSize.toFixed(2)} lot
  `;
}

// Fungsi untuk menyimpan hasil
function saveResult() {
  const entry = document.getElementById("entry").value;
  const exit = document.getElementById("exit").value;
  const lot = document.getElementById("lot").value;
  const sl = document.getElementById("sl").value;
  const tp = document.getElementById("tp").value;
  const balance = document.getElementById("balance").value;
  const risk = document.getElementById("risk").value;
  const leverage = document.getElementById("leverage").value;
  
  const resultText = `
    Hasil Perhitungan Pip:
    ------------------------
    Harga Entry: ${entry}
    Harga Exit: ${exit}
    Ukuran Lot: ${lot}
    Stop Loss (SL): ${sl}
    Take Profit (TP): ${tp}
    Saldo Akun: ${balance}
    Persentase Risiko: ${risk}%
    Leverage: 1:${leverage}
    ------------------------
  `;

  const blob = new Blob([resultText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Hasil_Perhitungan_Pip.txt";
  link.click();
}
