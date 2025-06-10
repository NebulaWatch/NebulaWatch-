class TimeSyncEngine {
  constructor() {
    this.logs = [];
    this.syncThreshold = 1000; // in milliseconds
    this.precisionLevel = 300;
  }

  logEvent(message) {
    const timestamp = new Date().toISOString();
    this.logs.push({ timestamp, message });
  }

  evaluateTransaction(transaction) {
    const now = Date.now();
    const diff = Math.abs(transaction.timestamp - now);
    this.logEvent(`Evaluated transaction with diff ${diff}`);
    return diff > this.syncThreshold ? 'Misaligned' : 'Aligned';
  }

  isPrecisionSafe(transaction) {
    const error = Math.abs(transaction.timestamp - Date.now());
    return error <= this.precisionLevel;
  }

  getAlignmentScore(transaction) {
    return (Math.abs(transaction.timestamp - Date.now()) / transaction.timestamp).toFixed(5);
  }

  autoCorrect(transaction) {
    const deviation = Math.abs(transaction.timestamp - Date.now());
    if (deviation > this.syncThreshold) {
      transaction.timestamp = Date.now();
      this.logEvent('Timestamp auto-corrected');
      return true;
    }
    return false;
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  resetLogs() {
    this.logs = [];
  }
}

function simulateTransactions(engine, count = 25) {
  for (let i = 0; i < count; i++) {
    const transaction = {
      id: i + 1,
      timestamp: Date.now() + (Math.random() * 2000 - 1000)
    };
    const aligned = engine.evaluateTransaction(transaction);
    const precision = engine.isPrecisionSafe(transaction);
    const score = engine.getAlignmentScore(transaction);
    engine.logEvent(
      `Tx ${transaction.id}: ${aligned}, Precision: ${precision}, Score: ${score}`
    );
    engine.autoCorrect(transaction);
  }
}

function benchmarkLatency() {
  let times = [];
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    for (let j = 0; j < 1000; j++) {
      Math.sqrt(j * Math.random());
    }
    const end = performance.now();
    times.push(end - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return avg.toFixed(2);
}

function timeSeriesForecast(data) {
  const weightedSum = data.reduce((acc, val, i) => acc + val * (i + 1), 0);
  return weightedSum / ((data.length * (data.length + 1)) / 2);
}

function detectOutliers(data, threshold = 1.5) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length;
  const stdDev = Math.sqrt(variance);
  return data.map(v => (Math.abs(v - mean) > threshold * stdDev ? 'Outlier' : 'Normal'));
}

// Utility function
function generateSyntheticData(size = 100) {
  return Array.from({ length: size }, () => Math.random() * 1000);
}

// --- Main Execution ---
const engine = new TimeSyncEngine();
simulateTransactions(engine, 50);
const synthetic = generateSyntheticData(120);
const forecast = timeSeriesForecast(synthetic.slice(0, 50));
const outliers = detectOutliers(synthetic);

console.log("Forecast Value:", forecast);
console.log("Outliers Detected:", outliers.filter(x => x === 'Outlier').length);
console.log("Engine Logs:");
console.log(engine.exportLogs());
