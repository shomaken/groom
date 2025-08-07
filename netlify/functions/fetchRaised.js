const fetch = require('node-fetch'); // required for Node.js < 18

// Cache for SOL price to avoid excessive API calls
let solPriceCache = {
  price: 170, // fallback price
  lastUpdated: 0,
  cacheDuration: 60 * 60 * 1000 // 1 hour in milliseconds
};

// Function to fetch current SOL price
async function getSolPrice() {
  const now = Date.now();
  
  // Return cached price if it's still valid (less than 1 hour old)
  if (now - solPriceCache.lastUpdated < solPriceCache.cacheDuration) {
    console.log(`Using cached SOL price: $${solPriceCache.price}`);
    return solPriceCache.price;
  }
  
  try {
    console.log('Fetching fresh SOL price...');
    
    // Try multiple SOL price APIs for reliability
    const priceApis = [
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
      'https://api.coinbase.com/v2/prices/SOL-USD/spot'
    ];
    
    for (const apiUrl of priceApis) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'GROOM-Wedding-App/1.0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          let solPrice = null;
          
          // Parse different API response formats
          if (apiUrl.includes('coingecko')) {
            solPrice = data.solana?.usd;
          } else if (apiUrl.includes('binance')) {
            solPrice = parseFloat(data.price);
          } else if (apiUrl.includes('coinbase')) {
            solPrice = parseFloat(data.data.amount);
          }
          
          if (solPrice && solPrice > 0) {
            // Update cache
            solPriceCache.price = solPrice;
            solPriceCache.lastUpdated = now;
            
            console.log(`✅ SOL price updated: $${solPrice} from ${apiUrl.split('/')[2]}`);
            return solPrice;
          }
        }
      } catch (error) {
        console.log(`❌ Failed to fetch SOL price from ${apiUrl.split('/')[2]}: ${error.message}`);
      }
    }
    
    // If all APIs fail, use cached price or fallback
    console.log(`⚠️ All SOL price APIs failed, using cached price: $${solPriceCache.price}`);
    return solPriceCache.price;
    
  } catch (error) {
    console.log(`❌ Error fetching SOL price: ${error.message}`);
    return solPriceCache.price; // Return cached or fallback price
  }
}

// Function to fetch real token metrics from multiple APIs
async function getTokenMetrics(mint) {
  try {
    console.log('Fetching real token metrics from multiple APIs...');
    
    // Try multiple APIs in order of preference - Dexscreener first for volume
    const apis = [
      {
        name: 'Dexscreener',
        url: `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
        parse: (data) => {
          const pairs = data.pairs;
          if (pairs && pairs.length > 0) {
            const pair = pairs[0];
            return {
              price: parseFloat(pair.priceUsd) || 0,
              volume: parseFloat(pair.volume24h) || parseFloat(pair.volume) || 0,
              marketCap: parseFloat(pair.marketCap) || 0
            };
          }
          return null;
        }
      },
      {
        name: 'Dexscreener Search',
        url: `https://api.dexscreener.com/latest/dex/search?q=${mint}`,
        parse: (data) => {
          const pairs = data.pairs;
          if (pairs && pairs.length > 0) {
            const pair = pairs[0];
            return {
              price: parseFloat(pair.priceUsd) || 0,
              volume: parseFloat(pair.volume24h) || parseFloat(pair.volume) || 0,
              marketCap: parseFloat(pair.marketCap) || 0
            };
          }
          return null;
        }
      },
      {
        name: 'Birdeye',
        url: `https://public-api.birdeye.so/public/price?address=${mint}`,
        parse: (data) => {
          if (data.success && data.data) {
            return {
              price: data.data.value,
              volume: data.data.volume24h || data.data.volume || 0,
              marketCap: data.data.marketCap || 0
            };
          }
          return null;
        }
      },
      {
        name: 'Birdeye Volume',
        url: `https://public-api.birdeye.so/public/tokenlist?address=${mint}`,
        parse: (data) => {
          if (data.success && data.data && data.data.length > 0) {
            const token = data.data[0];
            return {
              price: token.price || 0,
              volume: token.volume24h || token.volume || 0,
              marketCap: token.marketCap || 0
            };
          }
          return null;
        }
      },
      {
        name: 'Jupiter',
        url: `https://price.jup.ag/v4/price?ids=${mint}`,
        parse: (data) => {
          const tokenData = data.data[mint];
          if (tokenData) {
            return {
              price: tokenData.price,
              volume: tokenData.volume24h || tokenData.volume || 0,
              marketCap: tokenData.price * 1000000000 // Estimate with 1B supply
            };
          }
          return null;
        }
      },
      {
        name: 'Raydium',
        url: `https://api.raydium.io/v2/sdk/liquidity/mainnet/${mint}`,
        parse: (data) => {
          if (data && data.price) {
            return {
              price: data.price,
              volume: data.volume24h || data.volume || 0,
              marketCap: data.marketCap || 0
            };
          }
          return null;
        }
      }
    ];
    
    for (const api of apis) {
      try {
        console.log(`Trying ${api.name} API...`);
        
        const response = await fetch(api.url, {
          headers: {
            'User-Agent': 'GROOM-Wedding-App/1.0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`${api.name} API response:`, JSON.stringify(data, null, 2));
          
          const parsed = api.parse(data);
          if (parsed && parsed.price > 0) {
            console.log(`✅ ${api.name} API success:`, {
              price: parsed.price,
              volume: parsed.volume,
              marketCap: parsed.marketCap,
              volumeFormatted: formatCurrency(parsed.volume)
            });
            return {
              price: parsed.price,
              volume: parsed.volume,
              marketCap: parsed.marketCap,
              success: true,
              source: `${api.name} API`
            };
          }
        }
        
        console.log(`❌ ${api.name} API failed`);
      } catch (error) {
        console.log(`❌ ${api.name} API error: ${error.message}`);
      }
    }
    
    console.log('❌ All token metrics APIs failed');
    return { 
      success: false, 
      error: 'All token metrics APIs failed - token may not be listed yet' 
    };
    
  } catch (error) {
    console.log(`❌ Error fetching token metrics: ${error.message}`);
    return { success: false, error: error.message };
  }
}

exports.handler = async function (event, context) {
  const API_KEY = process.env.BAGS_API_KEY;
  const mint = "ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS"; // GROOM token
  
  // Bags.fm API endpoints for lifetime fees (official endpoint first)
  const possibleBagsEndpoints = [
    `https://public-api-v2.bags.fm/token-launch/lifetime-fees?tokenMint=${mint}`, // Official endpoint from docs
    `https://public-api-v2.bags.fm/api/v1/token-launch/lifetime-fees?tokenMint=${mint}`,
    `https://public-api-v2.bags.fm/api/token-launch/lifetime-fees?tokenMint=${mint}`,
    `https://public-api-v2.bags.fm/v1/token-launch/lifetime-fees?tokenMint=${mint}`
  ];
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
    
    // Try different Bags.fm API endpoints to find lifetime fees
    console.log('Testing Bags.fm API endpoints for lifetime fees...');
    console.log('Using API key:', API_KEY ? 'Present' : 'Missing');
    
    let data = null;
    let workingEndpoint = null;
    
    // Retry logic for transient failures
    const maxRetries = 2;
    let retryCount = 0;
    
    while (retryCount <= maxRetries && !data) {
      if (retryCount > 0) {
        console.log(`🔄 Retry attempt ${retryCount}/${maxRetries}...`);
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      for (const endpoint of possibleBagsEndpoints) {
        try {
          console.log(`Testing endpoint: ${endpoint}`);
          
          const res = await fetch(endpoint, {
            headers: {
              'x-api-key': API_KEY,
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          });

          console.log(`Status for ${endpoint}: ${res.status}`);

          if (res.ok) {
            data = await res.json();
            workingEndpoint = endpoint;
            console.log(`✅ SUCCESS! Working endpoint found: ${endpoint}`);
            console.log('Response data:', JSON.stringify(data, null, 2));
            break;
          } else {
            const errorText = await res.text();
            console.log(`❌ Failed ${endpoint}: ${res.status} - ${errorText.substring(0, 100)}...`);
          }
        } catch (error) {
          console.log(`❌ Error ${endpoint}: ${error.message}`);
        }
      }
      
      retryCount++;
    }

    if (!data) {
      console.log('❌ All Bags.fm endpoints failed - token may not be listed yet');
      throw new Error('All Bags.fm API endpoints failed - token may not be listed yet');
    }

    // Extract lifetime fees from Bags.fm API response
    console.log(`Processing lifetime fees from: ${workingEndpoint}`);
    
    // According to API docs, response contains:
    // { success: boolean, response: string (lamports) }
    const lifetimeFeesLamports = data.response || data.lifetimeFees || data.fees || '0';
    console.log('Raw lifetime fees (lamports string):', lifetimeFeesLamports);
    
    // Validate the lamports data
    if (!lifetimeFeesLamports || lifetimeFeesLamports === '0' || lifetimeFeesLamports === 'null') {
      console.log('❌ No lifetime fees data available - token may not have collected fees yet');
      throw new Error('No lifetime fees data available - token may not have collected fees yet');
    }
    
    // Convert lamports string to SOL
    const LAMPORTS_PER_SOL = 1000000000;
    let lifetimeFeesSOL = 0;
    
    try {
      // Parse the lamports string (supports bigint values and decimals)
      let lamportsValue;
      
      // Check if the value contains a decimal point
      if (lifetimeFeesLamports.includes('.')) {
        // Handle decimal values - this might be SOL instead of lamports
        const decimalValue = parseFloat(lifetimeFeesLamports);
        if (isNaN(decimalValue)) {
          throw new Error('Invalid decimal value');
        }
        
        // If the value is less than 1000, it's likely already in SOL
        if (decimalValue < 1000) {
          lifetimeFeesSOL = decimalValue;
          console.log(`Value appears to be in SOL: ${lifetimeFeesLamports} SOL`);
        } else {
          // If it's a large decimal, treat as lamports and convert
          lamportsValue = BigInt(Math.floor(decimalValue));
          lifetimeFeesSOL = Number(lamportsValue) / LAMPORTS_PER_SOL;
          console.log(`Converted ${lifetimeFeesLamports} lamports to ${lifetimeFeesSOL} SOL`);
        }
      } else {
        // Handle integer values directly
        lamportsValue = BigInt(lifetimeFeesLamports);
        lifetimeFeesSOL = Number(lamportsValue) / LAMPORTS_PER_SOL;
        console.log(`Converted ${lifetimeFeesLamports} lamports to ${lifetimeFeesSOL} SOL`);
      }
      
      // Validate the converted value
      if (lifetimeFeesSOL <= 0 || isNaN(lifetimeFeesSOL)) {
        console.log('❌ Invalid lifetime fees value after conversion');
        throw new Error('Invalid lifetime fees value after conversion');
      }
    } catch (error) {
      console.log('Error parsing lamports value:', error.message);
      throw new Error(`Failed to parse lifetime fees: ${error.message}`);
    }
    
    console.log(`Lifetime fees: ${lifetimeFeesSOL} SOL`);
    
    // Get current SOL price (cached for 1 hour)
    const solPrice = await getSolPrice();
    const lifetimeFeesUSD = lifetimeFeesSOL * solPrice;
    
    console.log(`SOL price: $${solPrice}, USD value: $${lifetimeFeesUSD.toFixed(2)}`);
    
    // Fetch real token metrics (price, market cap, volume)
    const tokenMetrics = await getTokenMetrics(mint);
    
    // Only use real data - no demo fallbacks
    if (!tokenMetrics.success) {
      throw new Error(`Failed to fetch token metrics: ${tokenMetrics.error || 'Unknown error'}`);
    }
    
    // Format response with ONLY real data
    const formattedData = {
      totalRaised: formatCurrency(lifetimeFeesUSD),
      totalRaisedSOL: `${lifetimeFeesSOL.toFixed(4)} SOL`,
      solPrice: solPrice,
      lifetimeFeesSOL: lifetimeFeesSOL.toFixed(6),
      lifetimeFeesLamports: lifetimeFeesLamports,
      price: formatPrice(tokenMetrics.price),
      marketCap: formatCurrency(tokenMetrics.marketCap),
      volume: formatCurrency(tokenMetrics.volume),
      holders: 'N/A', // Not available from most APIs
      lastUpdated: new Date().toISOString(),
      success: true,
      source: `Bags.fm Lifetime Fees + ${tokenMetrics.source}`,
      isRealLifetimeFees: true,
      isRealMetrics: true,
      metricsSource: tokenMetrics.source,
      workingEndpoint: workingEndpoint,
      apiSuccess: data.success || false,
      rawApiResponse: data
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
    
    // Return error response - no demo data
    return {
      statusCode: 200, // Return 200 to avoid frontend errors, but with error data
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: err.message,
        totalRaised: `Error: ${err.message}`,
        totalRaisedSOL: `Error: ${err.message}`,
        price: 'Error',
        marketCap: 'Error',
        volume: 'Error',
        holders: 'Error',
        lastUpdated: new Date().toISOString(),
        isRealLifetimeFees: false,
        isRealMetrics: false,
        note: 'API temporarily unavailable - please refresh to retry'
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

 
