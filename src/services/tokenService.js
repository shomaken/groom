// Netlify function endpoint
const NETLIFY_FUNCTION_URL = '/.netlify/functions/fetchRaised';

class TokenService {
  constructor() {
    this.cache = null;
    this.lastFetch = 0;
    this.cacheDuration = 60 * 1000; // 1 minute cache
  }

  /**
   * Fetch token metrics from our backend or return mock data
   */
  async getTokenMetrics() {
    try {
      const now = Date.now();
      
      // Return cached data if still fresh
      if (this.cache && (now - this.lastFetch) < this.cacheDuration) {
        return this.cache;
      }

      console.log('Fetching token metrics from Netlify function...');
      
      const response = await fetch(NETLIFY_FUNCTION_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update cache
      this.cache = data;
      this.lastFetch = now;
      
      console.log('Token metrics received:', data);
      return data;

    } catch (error) {
      console.error('Backend not available:', error.message);
      
      // Return cached data if available
      if (this.cache) {
        return { ...this.cache, error: 'Using cached data' };
      }
      
      // Return error state when backend is not available
      return {
        totalRaised: 'Error',
        marketCap: 'Error',
        price: 'Error',
        volume: 'Error',
        holders: 'Error',
        lastUpdated: new Date().toISOString(),
        success: false,
        error: error.message || 'Backend not available'
      };
    }
  }





  /**
   * Clear cache to force fresh data fetch
   */
  clearCache() {
    this.cache = null;
    this.lastFetch = 0;
  }

  /**
   * Format time ago string
   */
  getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;
