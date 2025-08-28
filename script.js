// YOUR ULTIMATE 21-INVESTMENT PORTFOLIO DASHBOARD
// ✅ API Key: KKV2RG3N00OPLLW1
// 🔧 ALL NAMES CORRECTED: RIO=Brazil, LCCN=China, SSLV=Silver, SGLP=Gold

const API_KEY = 'KKV2RG3N00OPLLW1';

// Portfolio settings
let portfolioSettings = {
    apiKey: 'KKV2RG3N00OPLLW1',
    monitoringFrequency: 'twice-daily',
    browserAlerts: true,
    maxDailyRequests: 500,
    usedRequests: 0
};

// YOUR CORRECTED 21 INVESTMENTS - ALL NAMES FIXED!
let watchlistData = [
    {symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'Large Cap ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'VEA', name: 'Vanguard Developed Markets ETF', type: 'International ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'Broad Market ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'EWJ', name: 'iShares MSCI Japan ETF', type: 'Country ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'VWO', name: 'Vanguard Emerging Markets ETF', type: 'Emerging Markets ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'HMEF', name: 'HSBC MSCI Emerging Markets UCITS ETF', type: 'Emerging Markets ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'RIO', name: 'Amundi MSCI Brazil ETF ACC', type: 'Country ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'LCCN', name: 'Amundi MSCI China ETF ACC', type: 'Country ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'BTCUSD', name: 'Bitcoin/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'ETHUSD', name: 'Ethereum/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'SOLUSD', name: 'Solana/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'XRPUSD', name: 'Ripple/USD', type: 'Cryptocurrency', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'SSLV', name: 'Invesco Physical Silver ETC', type: 'Precious Metals ETC', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'SGLP', name: 'Invesco Physical Gold ETC', type: 'Precious Metals ETC', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'GBPUSD', name: 'British Pound/USD', type: 'Forex Pair', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'USDINR', name: 'US Dollar/Indian Rupee', type: 'Forex Pair', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'VDWXEIA', name: 'Vanguard FTSE Developed World ex-UK Equity Index Fund GBP Acc', type: 'Index Fund', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'VUSEIDA', name: 'Vanguard US Equity Index Fund GBP Acc', type: 'Index Fund', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'RLOGESP', name: 'Royal London Global Equity Select Pension Fund', type: 'Pension Fund', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'VUSA', name: 'Vanguard S&P 500 UCITS ETF', type: 'S&P 500 ETF', currentPrice: 0, ma50: 0, position: 'unknown'},
    {symbol: 'IJPN', name: 'iShares Japan Equity Index Fund (UK) D Acc', type: 'Japan Index Fund', currentPrice: 0, ma50: 0, position: 'unknown'}
];

let alertsData = [];
let sortConfig = {key: null, direction: 'asc'};
let isChecking = false;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Your CORRECTED 21-Investment Portfolio Dashboard Loading...');
    console.log(`✅ API Key Connected: ${API_KEY.substring(0, 6)}...`);
    console.log('📊 Your investments:', watchlistData.map(inv => inv.symbol).join(', '));
    console.log('🔧 NAMES FIXED: RIO=Brazil ETF, LCCN=China ETF, SSLV=Silver, SGLP=Gold');

    loadSettings();
    loadSavedData();
    renderPortfolio();
    renderAlerts();
    updateStats();

    // Request notification permission
    setTimeout(requestNotificationPermission, 1000);

    console.log('✅ Dashboard Ready! All 21 investments with CORRECT names loaded!');
});

// Load settings
function loadSettings() {
    const saved = localStorage.getItem('portfolio-settings');
    if (saved) {
        const settings = JSON.parse(saved);
        portfolioSettings = {...portfolioSettings, ...settings};
    }

    // Reset daily usage counter if it's a new day
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('usage-reset-date');
    if (lastReset !== today) {
        portfolioSettings.usedRequests = 0;
        localStorage.setItem('usage-reset-date', today);
    }

    updateAPIUsage();
}

// Save settings
function saveSettings() {
    const frequency = document.getElementById('monitoring-frequency');
    const browserAlerts = document.getElementById('browser-alerts');

    if (frequency) portfolioSettings.monitoringFrequency = frequency.value;
    if (browserAlerts) portfolioSettings.browserAlerts = browserAlerts.checked;

    localStorage.setItem('portfolio-settings', JSON.stringify(portfolioSettings));
    updateAPIUsage();

    showMessage('✅ Settings saved successfully!', 'success');
}

// Load saved data
function loadSavedData() {
    const savedWatchlist = localStorage.getItem('portfolio-watchlist');
    if (savedWatchlist) {
        try {
            const saved = JSON.parse(savedWatchlist);
            // Merge saved data with current prices, but keep our 21 investments
            watchlistData.forEach((investment, index) => {
                const savedInvestment = saved.find(s => s.symbol === investment.symbol);
                if (savedInvestment) {
                    watchlistData[index] = {...investment, ...savedInvestment};
                }
            });
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }

    const savedAlerts = localStorage.getItem('portfolio-alerts');
    if (savedAlerts) {
        try {
            alertsData = JSON.parse(savedAlerts);
        } catch (e) {
            console.error('Error loading alerts:', e);
        }
    }
}

// Save data
function saveData() {
    try {
        localStorage.setItem('portfolio-watchlist', JSON.stringify(watchlistData));
        localStorage.setItem('portfolio-alerts', JSON.stringify(alertsData));
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// Render portfolio table
function renderPortfolio() {
    const tbody = document.getElementById('portfolio-tbody');
    if (!tbody) return;

    tbody.innerHTML = watchlistData.map((investment, index) => {
        const price = investment.currentPrice || 0;
        const ma50 = investment.ma50 || 0;
        const position = investment.position || 'unknown';
        const distance = price > 0 && ma50 > 0 ? ((price - ma50) / ma50 * 100).toFixed(2) : '0.00';
        const lastAlert = investment.lastAlert || 'None';

        let positionClass = 'position-unknown';
        let positionText = '⚪ Not checked';
        if (position === 'above') {
            positionClass = 'position-above';
            positionText = '🟢 Above MA';
        } else if (position === 'below') {
            positionClass = 'position-below';
            positionText = '🔴 Below MA';
        }

        // Add emoji for investment type
        let typeEmoji = '';
        if (investment.type.includes('Index Fund')) typeEmoji = '📊';
        else if (investment.type.includes('ETF')) typeEmoji = '🏢';
        else if (investment.type.includes('Crypto')) typeEmoji = '₿';
        else if (investment.type.includes('Forex')) typeEmoji = '💱';
        else if (investment.type.includes('Precious Metals')) typeEmoji = '🥇';
        else if (investment.type.includes('Pension')) typeEmoji = '🏦';

        return `
            <tr>
                <td><strong>${index + 1}. ${investment.symbol}</strong></td>
                <td>${typeEmoji} ${investment.name}</td>
                <td>${investment.type}</td>
                <td>${price > 0 ? (investment.type.includes('USD') ? '$' : '£') + price.toFixed(investment.type.includes('Crypto') ? 0 : 2) : 'Not checked'}</td>
                <td>${ma50 > 0 ? (investment.type.includes('USD') ? '$' : '£') + ma50.toFixed(investment.type.includes('Crypto') ? 0 : 2) : 'Not checked'}</td>
                <td><span class="${positionClass}">${positionText}</span></td>
                <td>${distance > 0 ? '+' : ''}${distance}%</td>
                <td>${lastAlert}</td>
            </tr>
        `;
    }).join('');
}

// Render alerts
function renderAlerts(filteredAlerts = null) {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;

    const alertsToShow = filteredAlerts || alertsData;

    if (alertsToShow.length === 0) {
        alertsList.innerHTML = `
            <div style="text-align: center; opacity: 0.6; padding: 30px;">
                <div style="font-size: 1.1em; margin-bottom: 8px;">No MA crossover alerts yet</div>
                <div>Check your 21-investment portfolio to start monitoring for 50-day moving average crossovers!</div>
            </div>
        `;
        return;
    }

    alertsList.innerHTML = alertsToShow.slice(0, 25).map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-header">
                <span class="alert-symbol">${alert.symbol}</span>
                <span class="alert-time">${alert.date} ${alert.time}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const total = watchlistData.length;
    const aboveMA = watchlistData.filter(inv => inv.position === 'above').length;
    const belowMA = watchlistData.filter(inv => inv.position === 'below').length;

    document.getElementById('total-investments').textContent = total;
    document.getElementById('above-ma').textContent = aboveMA;
    document.getElementById('below-ma').textContent = belowMA;

    updateAPIUsage();
}

// Update API usage display
function updateAPIUsage() {
    const usageElement = document.getElementById('api-usage');
    if (usageElement) {
        usageElement.textContent = `API Usage: ${portfolioSettings.usedRequests}/500 requests today`;
    }
}

// Main function: Check all 21 investments
async function checkAllInvestments() {
    if (isChecking) {
        showMessage('Portfolio check already in progress. Please wait...', 'warning');
        return;
    }

    // Calculate API usage
    const remainingRequests = portfolioSettings.maxDailyRequests - portfolioSettings.usedRequests;
    const investmentsToCheck = Math.min(watchlistData.length, remainingRequests);

    if (investmentsToCheck === 0) {
        showMessage('⚠️ Daily API limit reached! Try again tomorrow or wait for reset.', 'error');
        return;
    }

    if (investmentsToCheck < watchlistData.length) {
        const proceed = confirm(`⚠️ API Limit Warning!\n\nYou can check ${investmentsToCheck} of your 21 investments today.\n\nProceed with checking ${investmentsToCheck} investments?`);
        if (!proceed) return;
    }

    isChecking = true;
    const checkButton = document.querySelector('.btn-main');
    const originalText = checkButton.innerHTML;
    checkButton.innerHTML = '<span class="spinner"></span>Checking Your 21 Investments...';
    checkButton.disabled = true;

    let checkedCount = 0;
    let errorCount = 0;
    let crossoverCount = 0;

    try {
        showMessage(`📊 Checking ${investmentsToCheck} of your 21 investments... This will take several minutes due to API rate limits.`, 'success');

        // Process investments with proper rate limiting
        for (let i = 0; i < investmentsToCheck; i++) {
            const investment = watchlistData[i];

            try {
                // Update progress in button
                checkButton.innerHTML = `<span class="spinner"></span>Checking ${investment.symbol} (${i + 1}/${investmentsToCheck})...`;

                const crossoverDetected = await checkSingleInvestment(investment.symbol);
                if (crossoverDetected) crossoverCount++;

                checkedCount++;

                // Rate limiting: wait 12 seconds between requests (Alpha Vantage: 5/minute max)
                if (i < investmentsToCheck - 1) {
                    // Show countdown
                    for (let countdown = 12; countdown > 0; countdown--) {
                        checkButton.innerHTML = `<span class="spinner"></span>Next check in ${countdown}s... (${i + 1}/${investmentsToCheck} done)`;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

            } catch (error) {
                console.error(`Error checking ${investment.symbol}:`, error);
                errorCount++;
            }
        }

        // Final update
        renderPortfolio();
        renderAlerts();
        updateStats();
        saveData();

        // Results summary
        let resultMessage = `✅ Portfolio check complete!\n\n`;
        resultMessage += `📊 Checked: ${checkedCount} investments\n`;
        if (errorCount > 0) resultMessage += `❌ Errors: ${errorCount}\n`;
        if (crossoverCount > 0) resultMessage += `🚨 New crossover alerts: ${crossoverCount}\n`;
        resultMessage += `📈 API calls used: ${portfolioSettings.usedRequests}/500`;

        showMessage(resultMessage.replace(/\n/g, ' | '), checkedCount > 0 ? 'success' : 'error');

    } catch (error) {
        console.error('Portfolio check error:', error);
        showMessage('❌ Error during portfolio check. Please try again later.', 'error');
    } finally {
        isChecking = false;
        checkButton.innerHTML = originalText;
        checkButton.disabled = false;
    }
}

// Check single investment
async function checkSingleInvestment(symbol) {
    try {
        // Handle crypto and forex symbols for Alpha Vantage
        let apiFunction = 'TIME_SERIES_DAILY';
        let adjustedSymbol = symbol;

        // For crypto pairs, use digital currency daily
        if (symbol.includes('USD') && ['BTC', 'ETH', 'SOL', 'XRP'].some(crypto => symbol.startsWith(crypto))) {
            apiFunction = 'DIGITAL_CURRENCY_DAILY';
            const cryptoCode = symbol.replace('USD', '');
            adjustedSymbol = cryptoCode;
        }

        const url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${adjustedSymbol}&market=USD&apikey=${API_KEY}`;

        console.log(`Fetching data for ${symbol}...`);
        const response = await fetch(url);
        const data = await response.json();

        portfolioSettings.usedRequests++;
        updateAPIUsage();

        if (data['Error Message']) {
            throw new Error(`API Error: ${data['Error Message']}`);
        }

        if (data['Note']) {
            throw new Error('API rate limit reached');
        }

        // Handle different data structures
        let timeSeries;
        if (apiFunction === 'DIGITAL_CURRENCY_DAILY') {
            timeSeries = data['Time Series (Digital Currency Daily)'];
        } else {
            timeSeries = data['Time Series (Daily)'];
        }

        if (!timeSeries) {
            throw new Error('No time series data available');
        }

        // Process data
        const dates = Object.keys(timeSeries).sort().reverse();
        if (dates.length < 50) {
            throw new Error(`Only ${dates.length} days of data available (need 50 for MA)`);
        }

        const recentData = dates.slice(0, 51).map(date => {
            const dayData = timeSeries[date];
            let closePrice;

            if (apiFunction === 'DIGITAL_CURRENCY_DAILY') {
                closePrice = parseFloat(dayData['4a. close (USD)']);
            } else {
                closePrice = parseFloat(dayData['4. close']);
            }

            return {
                date,
                price: closePrice
            };
        }).reverse(); // Oldest first for MA calculation

        const currentPrice = recentData[recentData.length - 1].price;
        const previousPrice = recentData.length > 1 ? recentData[recentData.length - 2].price : currentPrice;

        // Calculate moving averages
        const currentMA = recentData.slice(-50).reduce((sum, day) => sum + day.price, 0) / 50;
        const previousMA = recentData.slice(-51, -1).reduce((sum, day) => sum + day.price, 0) / 50;

        // Update investment data
        const investmentIndex = watchlistData.findIndex(inv => inv.symbol === symbol);
        if (investmentIndex !== -1) {
            watchlistData[investmentIndex].currentPrice = currentPrice;
            watchlistData[investmentIndex].ma50 = currentMA;
            watchlistData[investmentIndex].position = currentPrice > currentMA ? 'above' : 'below';
            watchlistData[investmentIndex].lastChecked = new Date().toISOString();

            // Check for crossover and return whether one was detected
            return checkForCrossover(symbol, currentPrice, previousPrice, currentMA, previousMA);
        }

        console.log(`✅ ${symbol}: $$${currentPrice.toFixed(2)} vs MA $$${currentMA.toFixed(2)}`);
        return false;

    } catch (error) {
        console.error(`❌ Error checking ${symbol}:`, error);

        // For errors, show a user-friendly message but don't stop the whole process
        if (error.message.includes('premium')) {
            console.log(`⚠️ ${symbol}: Premium data required (skipping)`);
        } else if (error.message.includes('rate limit')) {
            console.log(`⚠️ ${symbol}: Rate limit reached`);
        } else {
            console.log(`⚠️ ${symbol}: ${error.message}`);
        }

        throw error;
    }
}

// Check for MA crossover
function checkForCrossover(symbol, currentPrice, previousPrice, currentMA, previousMA) {
    try {
        let crossoverType = null;
        let message = '';

        // Bullish crossover: price crosses above MA
        if (previousPrice <= previousMA && currentPrice > currentMA) {
            crossoverType = 'bullish';
            message = `🟢 ${symbol} BULLISH CROSSOVER! Price crosses ABOVE 50-day MA: $$${currentPrice.toFixed(2)} > $$${currentMA.toFixed(2)}`;
        }
        // Bearish crossover: price crosses below MA  
        else if (previousPrice >= previousMA && currentPrice < currentMA) {
            crossoverType = 'bearish';
            message = `🔴 ${symbol} BEARISH CROSSOVER! Price crosses BELOW 50-day MA: $$${currentPrice.toFixed(2)} < $$${currentMA.toFixed(2)}`;
        }

        // Create alert if crossover detected
        if (crossoverType) {
            const alert = {
                id: Date.now() + Math.random(),
                symbol: symbol,
                type: crossoverType,
                message: message,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0].slice(0, 5),
                price: currentPrice,
                ma: currentMA,
                timestamp: new Date().toISOString()
            };

            alertsData.unshift(alert);
            alertsData = alertsData.slice(0, 100); // Keep latest 100

            // Update investment
            const investment = watchlistData.find(inv => inv.symbol === symbol);
            if (investment) {
                investment.lastAlert = alert.date;
                investment.alertType = crossoverType;
            }

            // Show notification
            if (portfolioSettings.browserAlerts) {
                showNotification(`${symbol} MA Crossover`, message);
            }

            console.log(`🚨 CROSSOVER DETECTED: ${message}`);
            return true;
        }

        return false;

    } catch (error) {
        console.error(`Error checking crossover for ${symbol}:`, error);
        return false;
    }
}

// Utility functions
function sortTable(key) {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    watchlistData.sort((a, b) => {
        let aVal = a[key] || 0;
        let bVal = b[key] || 0;

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        return direction === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    sortConfig = {key, direction};
    renderPortfolio();
}

function filterAlerts(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    let filteredAlerts = alertsData;

    if (filter === 'bullish') {
        filteredAlerts = alertsData.filter(alert => alert.type === 'bullish');
    } else if (filter === 'bearish') {
        filteredAlerts = alertsData.filter(alert => alert.type === 'bearish');
    } else if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredAlerts = alertsData.filter(alert => alert.date === today);
    }

    renderAlerts(filteredAlerts);
}

function refreshDisplay() {
    renderPortfolio();
    renderAlerts();
    updateStats();
    showMessage('📊 Display refreshed!', 'success');
}

function exportData() {
    try {
        const exportData = {
            portfolio: watchlistData,
            alerts: alertsData,
            settings: portfolioSettings,
            exportDate: new Date().toISOString(),
            totalInvestments: 21
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-21-investments-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showMessage('📊 Your 21-investment portfolio data exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showMessage('❌ Error exporting data', 'error');
    }
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showMessage('🔔 Notifications enabled! You will receive MA crossover alerts.', 'success');
                    testAlert();
                } else {
                    showMessage('⚠️ Notifications denied. You can still use the dashboard.', 'warning');
                }
            });
        } else if (Notification.permission === 'granted') {
            showMessage('✅ Notifications are already enabled!', 'success');
        }
    }
}

function testAlert() {
    const testMessage = 'This is how you will receive MA crossover alerts for your 21 investments!';
    showNotification('📊 Test Alert', testMessage);

    // Add a test alert to the display
    const testAlert = {
        id: Date.now(),
        symbol: 'TEST',
        type: 'bullish',
        message: `🧪 TEST ALERT: ${testMessage}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        price: 0,
        ma: 0
    };

    alertsData.unshift(testAlert);
    renderAlerts();

    showMessage('🧪 Test alert sent! Check your notifications and alerts list.', 'success');
}

function showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            const notification = new Notification(title, {
                body: message,
                icon: '📊',
                tag: 'portfolio-alert-' + Date.now(),
                requireInteraction: true
            });

            setTimeout(() => {
                if (notification) notification.close();
            }, 15000);

        } catch (error) {
            console.error('Notification error:', error);
        }
    }
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel) {
        const isHidden = panel.style.display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';

        if (isHidden) {
            // Update settings UI when opened
            const freq = document.getElementById('monitoring-frequency');
            const alerts = document.getElementById('browser-alerts');

            if (freq) freq.value = portfolioSettings.monitoringFrequency;
            if (alerts) alerts.checked = portfolioSettings.browserAlerts;
        }
    }
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.dashboard-container');
    const header = document.querySelector('.dashboard-header');
    container.insertBefore(messageDiv, header.nextSibling);

    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 6000);
}

// Auto-save data every 2 minutes
setInterval(saveData, 120000);

console.log('🚀 Your CORRECTED 21-Investment Portfolio Dashboard is Ready!');
console.log('✅ API Key Configured:', API_KEY.substring(0, 8) + '...');
console.log('📊 Your 21 investments loaded with CORRECT FIXED names!');
console.log('🔧 FIXED: RIO=Brazil ETF | LCCN=China ETF | SSLV=Silver | SGLP=Gold');
console.log('💡 Click "Check All My Investments" to get current data and start monitoring!');
