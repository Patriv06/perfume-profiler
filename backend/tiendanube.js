const axios = require('axios');
const { dbAll, dbRun } = require('./db');

/**
 * Checks if the Tiendanube credentials are set in environment variables.
 * @returns {boolean}
 */
const hasTiendanubeConfig = () => {
  return !!(
    process.env.TIENDANUBE_STORE_ID &&
    process.env.TIENDANUBE_ACCESS_TOKEN &&
    process.env.TIENDANUBE_ACCESS_TOKEN !== 'your_access_token_here'
  );
};

/**
 * Creates 4 test products in Tiendanube (or mocks them if credentials are missing).
 * Updates SQLite database with the returned tiendanube_id and variant_id.
 */
const setupTestProducts = async () => {
  const storeId = process.env.TIENDANUBE_STORE_ID;
  const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;
  const userAgent = process.env.TIENDANUBE_USER_AGENT || 'PerfumeProfilerApp (perfumes@example.com)';

  console.log('Starting Tiendanube setup...');

  // Fetch products from SQLite database
  const products = await dbAll('SELECT * FROM products');

  if (!hasTiendanubeConfig()) {
    console.log('--- Tiendanube Credentials NOT found. Running in SIMULATED (MOCK) Mode ---');
    
    for (const prod of products) {
      // Create mock ids
      const mockProductId = `mock-tiendanube-prod-${prod.id}`;
      const mockVariantId = `12345678${prod.id}`; // 9-digit variant ID similar to Tiendanube format
      const mockCanonicalUrl = `https://tienda-simulada.mitiendanube.com/productos/mock-${prod.sku.toLowerCase()}`;
      
      await dbRun(
        'UPDATE products SET tiendanube_id = ?, variant_id = ?, canonical_url = ? WHERE id = ?',
        [mockProductId, mockVariantId, mockCanonicalUrl, prod.id]
      );
      
      console.log(`[SIMULATED] Product "${prod.name}" updated with variant_id: ${mockVariantId}, URL: ${mockCanonicalUrl}`);
    }
    
    return {
      success: true,
      mode: 'mock',
      message: 'Productos simulados creados con éxito en base de datos local.'
    };
  }

  console.log(`--- Tiendanube Credentials FOUND. Running in LIVE API Mode for Store ID: ${storeId} ---`);
  
  const createdProducts = [];
  
  for (const prod of products) {
    const url = `https://api.tiendanube.com/v1/${storeId}/products`;
    
    const requestBody = {
      name: {
        es: prod.name
      },
      description: {
        es: prod.description
      },
      published: true,
      variants: [
        {
          price: prod.price,
          stock: 50,
          sku: prod.sku
        }
      ]
    };

    try {
      console.log(`Sending POST to Tiendanube to create: "${prod.name}"...`);
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authentication': `bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': userAgent
        }
      });
      
      const responseData = response.data;
      const tiendanubeId = responseData.id;
      // Get the variant_id of the first variant
      const variantId = responseData.variants && responseData.variants[0] ? responseData.variants[0].id : null;
      const canonicalUrl = responseData.canonical_url || '';
      
      if (!variantId) {
        throw new Error(`Product response did not include a valid variant_id.`);
      }

      await dbRun(
        'UPDATE products SET tiendanube_id = ?, variant_id = ?, canonical_url = ? WHERE id = ?',
        [String(tiendanubeId), String(variantId), String(canonicalUrl), prod.id]
      );

      console.log(`[LIVE] Product "${prod.name}" created successfully. Tiendanube ID: ${tiendanubeId}, Variant ID: ${variantId}, URL: ${canonicalUrl}`);
      createdProducts.push({ name: prod.name, tiendanubeId, variantId });

      // Optional: upload product image to Tiendanube if we have it
      if (prod.image_url) {
        try {
          console.log(`Uploading image for product ${tiendanubeId}...`);
          const imageUrl = `https://api.tiendanube.com/v1/${storeId}/products/${tiendanubeId}/images`;
          await axios.post(imageUrl, { src: prod.image_url }, {
            headers: {
              'Authentication': `bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'User-Agent': userAgent
            }
          });
          console.log(`Image uploaded successfully for product ${tiendanubeId}`);
        } catch (imgError) {
          console.error(`Warning: Failed to upload image for product ${prod.name}:`, imgError.message);
        }
      }

    } catch (error) {
      console.error(`Error creating product "${prod.name}" in Tiendanube:`, error.response ? error.response.data : error.message);
      throw new Error(`Failed to create product in Tiendanube: ${error.message}`);
    }
  }

  return {
    success: true,
    mode: 'live',
    message: 'Productos creados con éxito en Tiendanube y actualizados en la base de datos.',
    details: createdProducts
  };
};

module.exports = {
  setupTestProducts,
  hasTiendanubeConfig
};
