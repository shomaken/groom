const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const mint = "81KzC6LsZEN4BGcMRcg5BoanAsXk4ctP8gFhQDweBAGS";
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const results = {};

  // Test Solscan
  try {
    const solscanRes = await fetch(`https://api.solscan.io/token/meta?token=${mint}`);
    results.solscan = {
      status: solscanRes.status,
      exists: solscanRes.ok
    };
  } catch (error) {
    results.solscan = { status: 'error', error: error.message };
  }

  // Test Jupiter
  try {
    const jupiterRes = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`);
    const jupiterData = await jupiterRes.json();
    results.jupiter = {
      status: jupiterRes.status,
      exists: jupiterRes.ok && jupiterData.data && jupiterData.data[mint]
    };
  } catch (error) {
    results.jupiter = { status: 'error', error: error.message };
  }

  // Test Birdeye
  try {
    const birdeyeRes = await fetch(`https://public-api.birdeye.so/public/price?address=${mint}`);
    results.birdeye = {
      status: birdeyeRes.status,
      exists: birdeyeRes.ok
    };
  } catch (error) {
    results.birdeye = { status: 'error', error: error.message };
  }

  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mint,
      results,
      timestamp: new Date().toISOString()
    })
  };
}; 