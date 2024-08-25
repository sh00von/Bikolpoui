// utils/fetchData.js
export const fetchAndCacheData = async (url) => {
    const cacheKey = 'productsData';
    const cacheExpiryKey = 'productsDataExpiry';
    const cacheDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  
    try {
      const cachedExpiry = localStorage.getItem(cacheExpiryKey);
      if (cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          console.log('Using cached data');
          return JSON.parse(cachedData);
        }
      }
  
      console.log('Fetching new data from API');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
  
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheExpiryKey, (Date.now() + cacheDuration).toString());
  
      console.log('Data cached successfully');
      return data;
    } catch (error) {
      console.error('Error fetching or caching data:', error);
      throw error;
    }
  };
  