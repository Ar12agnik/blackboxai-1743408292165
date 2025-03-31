const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

// Serve static files with proper precedence
app.use('/styles.css', express.static(path.join(__dirname, 'public/styles.css')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// API proxy endpoint (placeholder for real API integration)
app.get('/api/stock/:symbol', (req, res) => {
    const { symbol } = req.params;
    
    // In a real implementation, you would:
    // 1. Validate the symbol
    // 2. Make request to financial API (Alpha Vantage, Yahoo Finance, etc.)
    // 3. Transform the response
    // 4. Send back to client
    
    // Mock response for demonstration
    res.json({
        symbol: symbol,
        name: `${symbol} Company`,
        price: (Math.random() * 500).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: (Math.random() * 5 - 2.5).toFixed(2),
        marketCap: `${(Math.random() * 500).toFixed(2)}B`
    });
});

// Historical data endpoint
app.get('/api/historical/:symbol', (req, res) => {
    const { symbol } = req.params;
    const { range } = req.query;
    
    // Generate mock historical data
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
    
    res.json({ labels, data });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}/index.html`);
});