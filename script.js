// DOM Elements
const searchInput = document.getElementById('stockSearch');
const searchBtn = document.getElementById('searchBtn');
const watchlistContainer = document.getElementById('watchlist');
const stockTitle = document.getElementById('stockTitle');
const stockSymbol = document.getElementById('stockSymbol');
const stockName = document.getElementById('stockName');
const stockPrice = document.getElementById('stockPrice');
const stockChange = document.getElementById('stockChange');
const marketCap = document.getElementById('marketCap');
const addToWatchlistBtn = document.getElementById('addToWatchlist');
const priceChart = document.getElementById('priceChart');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const timeButtons = document.querySelectorAll('.time-btn');

// Global Variables
let currentStock = null;
let chart = null;
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the dashboard page
    if (document.getElementById('stockTitle')) {
        const urlParams = new URLSearchParams(window.location.search);
        const symbol = urlParams.get('symbol');
        
        if (symbol) {
            currentStock = symbol;
            fetchStockData(symbol);
            fetchHistoricalData(symbol, '1m');
        } else {
            showError('No stock symbol provided');
        }
    }

    // Load watchlist if on home page
    if (watchlistContainer) {
        loadWatchlist();
    }

    // Event Listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    if (addToWatchlistBtn) {
        addToWatchlistBtn.addEventListener('click', addToWatchlist);
    }

    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.replace('bg-blue-100', 'bg-gray-100'));
            timeButtons.forEach(b => b.classList.replace('text-blue-800', 'text-gray-800'));
            btn.classList.replace('bg-gray-100', 'bg-blue-100');
            btn.classList.replace('text-gray-800', 'text-blue-800');
            fetchHistoricalData(currentStock, btn.dataset.range);
        });
    });
});

// Functions
async function fetchStockData(symbol) {
    try {
        // In a real app, you would use a real API endpoint here
        // This is a mock implementation for demonstration
        const mockData = {
            symbol: symbol,
            name: `${symbol} Company`,
            price: (Math.random() * 500).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2),
            changePercent: (Math.random() * 5 - 2.5).toFixed(2),
            marketCap: `${(Math.random() * 500).toFixed(2)}B`
        };

        updateStockUI(mockData);
    } catch (error) {
        showError('Failed to fetch stock data');
        console.error(error);
    }
}

async function fetchHistoricalData(symbol, range) {
    try {
        // In a real app, you would use a real API endpoint here
        // This is a mock implementation for demonstration
        const mockData = generateMockHistoricalData(range);
        updateChart(mockData);
    } catch (error) {
        showError('Failed to fetch historical data');
        console.error(error);
    }
}

function generateMockHistoricalData(range) {
    const dataPoints = range === '1d' ? 24 : 
                      range === '1w' ? 7 : 
                      range === '1m' ? 30 : 
                      range === '3m' ? 90 : 365;
    
    const labels = [];
    const data = [];
    
    for (let i = 0; i < dataPoints; i++) {
        labels.push(`Day ${i + 1}`);
        data.push((Math.random() * 500).toFixed(2));
    }
    
    return { labels, data };
}

function updateStockUI(data) {
    stockTitle.textContent = `${data.symbol} Stock`;
    stockSymbol.textContent = data.symbol;
    stockName.textContent = data.name;
    stockPrice.textContent = `$${data.price}`;
    
    const changeValue = parseFloat(data.change);
    const changeElement = stockChange.querySelector('.change-value');
    const percentElement = stockChange.querySelector('.change-percent');
    
    changeElement.textContent = `${changeValue >= 0 ? '+' : ''}${data.change}`;
    percentElement.textContent = `(${data.changePercent}%)`;
    
    if (changeValue >= 0) {
        stockChange.classList.add('text-green-600');
        stockChange.classList.remove('text-red-600');
    } else {
        stockChange.classList.add('text-red-600');
        stockChange.classList.remove('text-green-600');
    }
    
    marketCap.textContent = `$${data.marketCap}`;
}

function updateChart(chartData) {
    const ctx = priceChart.getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Stock Price',
                data: chartData.data,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function handleSearch() {
    const symbol = searchInput.value.trim().toUpperCase();
    
    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }
    
    // In a real app, you would validate the symbol format
    window.location.href = `dashboard.html?symbol=${symbol}`;
}

function loadWatchlist() {
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = '<p class="text-gray-500 italic">No stocks added yet</p>';
        return;
    }
    
    watchlistContainer.innerHTML = '';
    watchlist.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
        stockElement.innerHTML = `
            <div>
                <span class="font-medium">${stock.symbol}</span>
                <span class="text-gray-500 text-sm ml-2">${stock.name}</span>
            </div>
            <div class="flex space-x-2">
                <button class="view-btn text-blue-600 hover:text-blue-800" data-symbol="${stock.symbol}">
                    <i class="fas fa-chart-line"></i>
                </button>
                <button class="remove-btn text-red-600 hover:text-red-800" data-symbol="${stock.symbol}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        watchlistContainer.appendChild(stockElement);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = `dashboard.html?symbol=${btn.dataset.symbol}`;
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromWatchlist(btn.dataset.symbol);
        });
    });
}

function addToWatchlist() {
    if (!currentStock) return;
    
    const existingStock = watchlist.find(stock => stock.symbol === currentStock);
    if (existingStock) {
        showError('Stock already in watchlist');
        return;
    }
    
    watchlist.push({
        symbol: currentStock,
        name: stockName.textContent
    });
    
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    showSuccess('Added to watchlist');
}

function removeFromWatchlist(symbol) {
    watchlist = watchlist.filter(stock => stock.symbol !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    loadWatchlist();
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

function showSuccess(message) {
    // In a real app, you would show a success notification
    console.log(message);
}