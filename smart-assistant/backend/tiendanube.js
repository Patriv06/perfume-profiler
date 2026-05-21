const axios = require('axios');

const USER_AGENT = process.env.TIENDANUBE_USER_AGENT || 'SmartShoppingAssistant (support@quanticia.com.ar)';

/**
 * Fetches all products from a Tiendanube store.
 * @param {string} storeId 
 * @param {string} accessToken 
 * @returns {Promise<Array>}
 */
const fetchStoreProducts = async (storeId, accessToken) => {
  const url = `https://api.tiendanube.com/v1/${storeId}/products`;
  try {
    console.log(`[Tiendanube API] Fetching products for store: ${storeId}`);
    const response = await axios.get(url, {
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'User-Agent': USER_AGENT
      }
    });
    return response.data;
  } catch (error) {
    console.error(`[Tiendanube API] Error fetching products for store ${storeId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Registers our widget script in the Tiendanube storefront scripts manager.
 * @param {string} storeId 
 * @param {string} accessToken 
 * @param {string} scriptUrl 
 * @returns {Promise<Object>}
 */
const registerStorefrontScript = async (storeId, accessToken, scriptUrl) => {
  const url = `https://api.tiendanube.com/v1/${storeId}/scripts`;
  
  // First check if our script is already registered
  try {
    console.log(`[Tiendanube API] Checking existing scripts for store: ${storeId}`);
    const checkResponse = await axios.get(url, {
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'User-Agent': USER_AGENT
      }
    });
    
    const existingScripts = checkResponse.data || [];
    const alreadyRegistered = existingScripts.find(s => s.src === scriptUrl);
    if (alreadyRegistered) {
      console.log(`[Tiendanube API] Script ${scriptUrl} is already registered on store ${storeId}.`);
      return alreadyRegistered;
    }
  } catch (error) {
    console.warn(`[Tiendanube API] Failed to query existing scripts for store ${storeId}:`, error.message);
  }

  // If not already registered, register it
  try {
    console.log(`[Tiendanube API] Registering script ${scriptUrl} on store: ${storeId}`);
    const response = await axios.post(url, {
      src: scriptUrl,
      event: 'onload'
    }, {
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT
      }
    });
    return response.data;
  } catch (error) {
    console.error(`[Tiendanube API] Error registering script for store ${storeId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  fetchStoreProducts,
  registerStorefrontScript
};
