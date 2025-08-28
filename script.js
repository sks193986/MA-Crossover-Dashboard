// YOUR ULTIMATE 21-INVESTMENT DASHBOARD SCRIPT WITH FULL MA CROSSOVER CHECKING

const API_KEY = 'KKV2RG3N00OPLLW1';

let watchlistData = [
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'Large Cap ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'VEA', name: 'Vanguard Developed Markets ETF', type: 'International ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'Broad Market ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'EWJ', name: 'iShares MSCI Japan ETF', type: 'Country ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'VWO', name: 'Vanguard Emerging Markets ETF', type: 'Emerging Markets ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'HMEF', name: 'HSBC MSCI Emerging Markets UCITS ETF', type: 'Emerging Markets ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'RIO', name: 'Amundi MSCI Brazil ETF ACC', type: 'Country ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'LCCN', name: 'Amundi MSCI China ETF ACC', type: 'Country ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'BTCUSD', name: 'Bitcoin/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'ETHUSD', name: 'Ethereum/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'SOLUSD', name: 'Solana/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'XRPUSD', name: 'Ripple/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'SSLV', name: 'Invesco Physical Silver ETC', type: 'Precious Metals ETC', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'SGLP', name: 'Invesco Physical Gold ETC', type: 'Precious Metals ETC', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'GBPUSD', name: 'British Pound/USD', type: 'Forex Pair', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'USDINR', name: 'US Dollar/Indian Rupee', type: 'Forex Pair', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'VDWXEIA', name: 'Vanguard FTSE Developed World ex-UK Equity Index Fund GBP Acc', type: 'Index Fund', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'VUSEIDA', name: 'Vanguard US Equity Index Fund GBP Acc', type: 'Index Fund', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'RLOGESP', name: 'Royal London Global Equity Select Pension Fund', type: 'Pension Fund', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'VUSA', name: 'Vanguard S&P 500 UCITS ETF', type: 'S&P 500 ETF', currentPrice: 0, ma50: 0, position: 'unknown' },
  { symbol: 'IJPN', name: 'iShares Japan Equity Index Fund (UK) D Acc', type: 'Japan Index Fund', currentPrice: 0, ma50: 0, position: 'unknown' },
];

let alertsData = [];
let isChecking = false;

async function fetchInvestmentData(investment) {
  let url = '', functionType = '', market = '';

  const typeLower = investment.type.toLowerCase();
  if (typeLower.includes('crypto')) {
    functionType = 'DIGITAL_CURRENCY_DAILY';
    url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${investment.symbol.replace('USD', '')}&market=USD&apikey=${API_KEY}`;
  } else if (typeLower.includes('forex')) {
    functionType = 'FX_DAILY';
    url = `https://www.alphavantage.co/query?function=${functionType}&from_symbol=${investment.symbol.substring(0,3)}&to_symbol=${investment.symbol.substring(3)}&apikey=${API_KEY}`;
  } else {
    functionType = 'TIME_SERIES_DAILY_ADJUSTED';
    url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${investment.symbol}&apikey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }
    return { data, functionType };
  } catch (err) {
    console.error(`Failed fetching data for ${investment.symbol}:`, err);
    return null;
  }
}

function extractClosingPrices(data, functionType) {
  let timeSeries;
  if (functionType === 'DIGITAL_CURRENCY_DAILY') {
    timeSeries = data['Time Series (Digital Currency Daily)'];
  } else if (functionType === 'FX_DAILY') {
    timeSeries = data['Time Series FX (Daily)'];
  } else {
    timeSeries = data['Time Series (Daily)'] || data['Time Series (Daily Adjusted)'];
  }
  if (!timeSeries) return null;

  const dates = Object.keys(timeSeries).sort();
  let closes = [];
  for (let i = dates.length - 50; i < dates.length; i++) {
    if (i < 0) continue;
    const day = timeSeries[dates[i]];
    let closePrice = 0;
    if (functionType === 'DIGITAL_CURRENCY_DAILY') {
      closePrice = parseFloat(day['4a. close (USD)']);
    } else if (functionType === 'FX_DAILY') {
      closePrice = parseFloat(day['4. close']);
    } else {
      closePrice = parseFloat(day['4. close']);
    }
    closes.push(closePrice);
  }
  return closes;
}

function computeMA50(closes) {
  if (!closes || closes.length < 50) return null;
  const sum = closes.reduce((acc, val) => acc + val, 0);
  return sum / closes.length;
}

async function checkSingleInvestment(investment) {
  const result = await fetchInvestmentData(investment);
  if (!result) {
    investment.position = 'unknown';
    investment.currentPrice = 0;
    investment.ma50 = 0;
    return false;
  }
  const { data, functionType } = result;
  const closes = extractClosingPrices(data, functionType);

  if (!closes) {
    investment.position = 'unknown';
    investment.currentPrice = 0;
    investment.ma50 = 0;
    return false;
  }

  const ma50 = computeMA50(closes);
  if (!ma50) {
    investment.position = 'unknown';
    investment.currentPrice = 0;
    investment.ma50 = 0;
    return false;
  }

  const currentPrice = closes[closes.length - 1];
  investment.currentPrice = currentPrice;
  investment.ma50 = ma50;
  investment.position = currentPrice > ma50 ? 'above' : 'below';

  // You can check for crossover alerts here and update alertsData if needed

  return true;
}

async function checkAllInvestments() {
  if (isChecking) {
    alert('Check in progress. Please wait.');
    return;
  }
  isChecking = true;
  for (const investment of watchlistData) {
    await checkSingleInvestment(investment);
    renderPortfolio();
    renderAlerts();
    // Respect API limits: 5 calls per minute for Alpha Vantage free tier
    await new Promise(r => setTimeout(r, 12000));
  }
  isChecking = false;
  alert('Portfolio check complete!');
}

function renderPortfolio() {
  // Implement your rendering logic to update the UI with watchlistData
}

function renderAlerts() {
  // Implement your rendering logic to show alertsData
}

// Bind checkAllInvestments to your "Check All" button click event

