const fetch = require('node-fetch'); // required for Node.js < 18

exports.handler = async function (event, context) {
  const API_KEY = process.env.BAGS_API_KEY;
  const mint = "9mAnyxAq8JQieHT7Lc47PVQbTK7ZVaaog8LwAbFzBAGS"; // GROOM token
  const bagsUrl = `https://public-api-v2.bags.fm/api/v1/analytics/token-metrics?mint=${mint}`;
  const birdeyeUrl = `https://public-api.birdeye.so/public/price?address=${mint}`;
  const jupiterUrl = `https://price.jup.ag/v4/price?ids=${mint}`;
  const raydiumUrl = `https://api.raydium.io/v2/sdk/liquidity/mainnet/${mint}`;
  const solscanUrl = `https://api.solscan.io/token/meta?token=${mint}`;

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // First, let's check if this is a valid Solana token
    console.log('Checking token validity for:', mint);
    
    // Try Bags.fm API only
    console.log('Making request to Bags.fm API:', bagsUrl);
    console.log('Using API key:', API_KEY ? 'Present' : 'Missing');
    
    const res = await fetch(bagsUrl, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('Bags.fm response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('Bags.fm error response:', errorText);
      throw new Error(`Bags.fm API failed: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    console.log('Bags.fm response data:', JSON.stringify(data, null, 2));

    // Format the Bags.fm API response
    const formattedData = {
      totalRaised: formatCurrency(data.response?.totalRaised || data.totalRaised || 0),
      price: formatPrice(data.response?.price || data.price || 0),
      marketCap: formatCurrency(data.response?.marketCap || data.marketCap || data.fdv || 0),
      volume: formatCurrency(data.response?.volume || data.volume || data.volume_24h || 0),
      holders: data.response?.holders || data.holders || data.holder_count || 0,
      lastUpdated: new Date().toISOString(),
      success: true,
      source: 'Bags.fm'
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    };
  } catch (err) {
    console.error('Error in fetchRaised function:', err);
    
    // Return demo data if anything fails
    const demoData = generateDemoData();
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...demoData,
        success: false,
        error: err.message,
        isDemoData: true,
        note: 'Demo data due to error'
      })
    };
  }
};

// Helper functions for formatting
function formatCurrency(value) {
  if (!value || value === 0) return '$0';
  
  if (typeof value === 'string') {
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

// Generate realistic demo data with growing trend
function generateDemoData() {
  // Simulate a growing token with realistic progression
  const timeFactor = Date.now() / 1000000; // Creates a slow upward trend
  const baseTotalRaised = 4800 + (timeFactor % 1000) + Math.random() * 500; // $4800-$6300
  const baseVolume = 12000 + (timeFactor % 3000) + Math.random() * 2000; // $12000-$17000
  const basePrice = 0.0015 + (timeFactor % 0.0005) + Math.random() * 0.0002; // $0.0015-$0.0022
  const baseMarketCap = 75000 + (timeFactor % 15000) + Math.random() * 10000; // $75000-$100000
  const baseHolders = 180 + Math.floor((timeFactor % 30) + Math.random() * 20); // 180-230 holders
  
  return {
    totalRaised: formatCurrency(baseTotalRaised),
    marketCap: formatCurrency(baseMarketCap),
    price: formatPrice(basePrice),
    volume: formatCurrency(baseVolume),
    holders: baseHolders,
    lastUpdated: new Date().toISOString()
  };
} 
