require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase, dbAll } = require('./db');
const { setupTestProducts, hasTiendanubeConfig } = require('./tiendanube');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database
initDatabase()
  .then(() => {
    console.log('Database initialized successfully.');
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// GET configuration
app.get('/api/config', (req, res) => {
  res.json({
    mode: hasTiendanubeConfig() ? 'live' : 'mock',
    storeUrl: process.env.TIENDANUBE_STORE_URL || 'https://tienda-simulada.mitiendanube.com',
    storeId: process.env.TIENDANUBE_STORE_ID || null
  });
});

// GET all products in the database
app.get('/api/products', async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// POST to setup test products in Tiendanube and update SQLite
app.post('/api/tiendanube/setup', async (req, res) => {
  try {
    const result = await setupTestProducts();
    res.json(result);
  } catch (error) {
    console.error('Error setting up products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al configurar productos de prueba en Tiendanube', 
      details: error.message 
    });
  }
});

// GET recommendation based on gender, moment, and note
app.get('/api/recommend', async (req, res) => {
  const { gender, moment, note } = req.query;

  if (!gender || !moment || !note) {
    return res.status(400).json({ 
      error: 'Faltan parámetros requeridos: gender, moment, note' 
    });
  }

  try {
    const products = await dbAll('SELECT * FROM products');
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'No hay productos en la matriz de recomendación.' });
    }

    // Scoring algorithm
    const scoredProducts = products.map((prod) => {
      let score = 0;

      // 1. Gender Scoring (Weights: Match = 3, Unisex match = 1, Mismatch = 0)
      if (prod.gender === gender) {
        score += 3;
      } else if (gender === 'Unisex' || prod.gender === 'Unisex') {
        score += 1;
      }

      // 2. Moment Scoring (Weights: Match = 2, Mismatch = 0)
      if (prod.moment === moment) {
        score += 2;
      }

      // 3. Olfactory Note Scoring (Weights: Match = 5, Mismatch = 0)
      if (prod.note === note) {
        score += 5;
      }

      return {
        ...prod,
        score
      };
    });

    // Sort by score descending, with secondary sorting by ID to maintain deterministic order
    scoredProducts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.id - b.id;
    });

    const recommendedProduct = scoredProducts[0];
    const storeUrl = process.env.TIENDANUBE_STORE_URL || 'https://tienda-simulada.mitiendanube.com';
    
    // Format cart checkout URL
    // Format: https://{store_url}/cart/add/?variant_id={variant_id}
    // Clean trailing slashes from storeUrl
    const cleanStoreUrl = storeUrl.replace(/\/+$/, '');
    const checkoutUrl = `${cleanStoreUrl}/cart/add/?variant_id=${recommendedProduct.variant_id}`;

    res.json({
      recommendation: recommendedProduct,
      checkoutUrl,
      debug: scoredProducts.map(p => ({ id: p.id, name: p.name, score: p.score }))
    });

  } catch (error) {
    console.error('Error during recommendation calculation:', error);
    res.status(500).json({ error: 'Error interno del recomendador', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
