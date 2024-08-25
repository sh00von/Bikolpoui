// utils/fetchData.js

export const fetchAndCacheData = async (url) => {
    const cacheKey = 'apiData';
    const cacheExpiryKey = 'apiDataExpiry';
    const cacheDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  
    // Check if the cached data is still valid
    const cachedExpiry = localStorage.getItem(cacheExpiryKey);
    if (cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
  
    // Fetch new data if cache is expired or not available
    const response = await fetch(url);
    const data = await response.json();
  
    // Store the new data and expiry timestamp in localStorage
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheExpiryKey, (Date.now() + cacheDuration).toString());
  
    return data;
  };
  