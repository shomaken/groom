const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build')); // Serve React build files

// Configuration
const BAGS_API_KEY = 'bags_prod_n3lcqLSEguU8Ob-1jArihws6LvNloc1wNZ8G-fwreds';
const TOKEN_MINT = 'dWd8vyAH9pQMMG1bkQWiGnyx8LjjuTDHsk8qcsCBAGS';
const BAGS_API_URL = `https://public-api-v2.bags.fm/api/v1/analytics/token-metrics?mint=${TOKEN_MINT}`;

// Cache for token metrics
let cachedMetrics = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

// Function to fetch token metrics from Bags.fm API
async function fetchTokenMetrics() {
  try {
    console.log('Fetching token metrics from Bags.fm API...');
    
    const response = await axios.get(BAGS_API_URL, {
      headers: {
        'Authorization': `Bearer ${BAGS_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'GROOM-Website/1.0'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('API Response:', response.data);

    // Extract and format the data based on API response structure
    const data = response.data;
    
    // Format the metrics (adjust based on actual API response structure)
    const metrics = {
      totalRaised: formatCurrency(data.totalRaised || data.total_raised || 0),
      marketCap: formatCurrency(data.marketCap || data.market_cap || data.fdv || 0),
      price: formatPrice(data.price || data.token_price || 0),
      volume: formatCurrency(data.volume || data.volume_24h || data.daily_volume || 0),
      holders: data.holders || data.holder_count || 0,
      lastUpdated: new Date().toISOString(),
      success: true
    };

    cachedMetrics = metrics;
    lastFetch = Date.now();
    
    console.log('Formatted metrics:', metrics);
    return metrics;

  } catch (error) {
    console.error('Error fetching token metrics:', error.message);
    
    // Return cached data if available, otherwise return error state
    if (cachedMetrics) {
      return { ...cachedMetrics, lastUpdated: new Date().toISOString() };
    }
    
    return {
      totalRaised: 'N/A',
      marketCap: 'N/A',
      price: 'N/A',
      volume: 'N/A',
      holders: 'N/A',
      lastUpdated: new Date().toISOString(),
      success: false,
      error: error.message
    };
  }
}

// Helper functions for formatting
function formatCurrency(value) {
  if (!value || value === 0) return '$0';
  
  if (typeof value === 'string') {
    // If it's already formatted or contains SOL, return as is
    if (value.includes('$') || value.includes('SOL')) return value;
    value = parseFloat(value);
  }
  
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

function formatPrice(value) {
  if (!value || value === 0) return '$0.00';
  
  if (typeof value === 'string') {
    if (value.includes('$')) return value;
    value = parseFloat(value);
  }
  
  if (value < 0.01) {
    return `$${value.toFixed(6)}`;
  } else {
    return `$${value.toFixed(4)}`;
  }
}

// API endpoint to get token metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const now = Date.now();
    
    // Check if we need to fetch new data
    if (!cachedMetrics || (now - lastFetch) > CACHE_DURATION) {
      await fetchTokenMetrics();
    }
    
    res.json(cachedMetrics || {
      totalRaised: 'Loading...',
      marketCap: 'Loading...',
      price: 'Loading...',
      volume: 'Loading...',
      holders: 'Loading...',
      lastUpdated: new Date().toISOString(),
      success: false
    });
    
  } catch (error) {
    console.error('Error in /api/metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch metrics',
      success: false,
      lastUpdated: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cachedData: !!cachedMetrics
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server and initial data fetch
app.listen(PORT, async () => {
  console.log(`🚀 GROOM Backend Server running on port ${PORT}`);
  console.log(`📊 Token Mint: ${TOKEN_MINT}`);
  console.log(`🔄 Fetching initial token data...`);
  
  // Fetch initial data
  await fetchTokenMetrics();
  
  // Set up periodic updates every minute
  setInterval(async () => {
    console.log('🔄 Periodic update - fetching fresh token data...');
    await fetchTokenMetrics();
  }, CACHE_DURATION);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});