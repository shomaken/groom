import axios from 'axios';

// Base URL for our backend API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://groom-backend-production.up.railway.app' // Railway backend URL
  : 'http://localhost:3001'; // In development, backend runs on port 3001

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

      console.log('Fetching token metrics from backend...');
      
      const response = await axios.get(`${API_BASE_URL}/api/metrics`, {
        timeout: 5000 // 5 second timeout
      });

      // Check if response is HTML (means backend not running)
      if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
        console.log('Backend not available');
        throw new Error('Backend server not available');
      }

      const data = response.data;
      
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
   * Get backend health status
   */
  async getHealthStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'ERROR',
        error: error.message
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
