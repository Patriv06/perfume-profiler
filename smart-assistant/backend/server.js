require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase, dbAll, dbRun, dbGet } = require('./db');
const { fetchStoreProducts } = require('./tiendanube');
const { autoTagProduct } = require('./tagger');
const templates = require('./templates');
const authRouter = require('./auth');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load static script loader
app.use(express.static('public'));

// Load auth router
app.use('/api/auth', authRouter);

// Initialize DB
initDatabase()
  .then(() => {
    console.log('Database initialized successfully.');
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// --- WIDGET API ---

/**
 * GET /api/widget/config
 * Retrieves the quiz questions and visual style for the given store_id
 */
app.get('/api/widget/config', async (req, res) => {
  const { store_id } = req.query;

  if (!store_id) {
    return res.status(400).json({ error: 'Falta store_id.' });
  }

  try {
    const tenant = await dbGet('SELECT * FROM tenants WHERE store_id = ?', [store_id]);
    if (!tenant) {
      return res.status(404).json({ error: 'Tienda no registrada.' });
    }

    const category = tenant.category || 'vinos';
    const template = templates[category] || templates.vinos;
    const config = JSON.parse(tenant.quiz_config || '{}');

    res.json({
      store_name: tenant.store_name,
      category: category,
      title: config.title || template.title,
      welcome_text: config.welcome_text || template.welcome_text,
      theme: {
        accent_color: config.accent_color || template.theme.accent_color,
        background_color: config.background_color || template.theme.background_color,
        text_color: config.text_color || template.theme.text_color,
        button_text: config.button_text || template.theme.button_text
      },
      questions: template.questions
    });

  } catch (error) {
    console.error('Error fetching widget config:', error);
    res.status(500).json({ error: 'Error interno de servidor.', details: error.message });
  }
});

/**
 * GET /api/recommend
 * Matches answers to product tags to find the best recommendation
 */
app.get('/api/recommend', async (req, res) => {
  const { store_id, answers } = req.query;

  if (!store_id || !answers) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos: store_id y answers.' });
  }

  try {
    const parsedAnswers = JSON.parse(answers); // e.g. { "maridaje": "carnes", "sabor": "tinto" }
    
    // Get store details
    const tenant = await dbGet('SELECT store_url FROM tenants WHERE store_id = ?', [store_id]);
    if (!tenant) {
      return res.status(404).json({ error: 'Tienda no encontrada.' });
    }

    // Get all products for this store
    const products = await dbAll('SELECT * FROM products WHERE store_id = ?', [store_id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'No hay productos configurados para esta tienda.' });
    }

    // Get all tags for all products in this store
    const tags = await dbAll('SELECT * FROM product_tags WHERE store_id = ?', [store_id]);

    // Build tag map for easier lookup: product_id -> Array of {key, value}
    const productTagsMap = {};
    tags.forEach(t => {
      if (!productTagsMap[t.product_id]) {
        productTagsMap[t.product_id] = [];
      }
      productTagsMap[t.product_id].push({ key: t.tag_key, value: t.tag_value });
    });

    // Score products
    const scoredProducts = products.map(prod => {
      let score = 0;
      const prodTags = productTagsMap[prod.id] || [];

      // Check match for each answer
      Object.keys(parsedAnswers).forEach(answerKey => {
        const answerVal = parsedAnswers[answerKey];
        // Look if product has this tag key-value pair
        const match = prodTags.find(t => t.key === answerKey && t.value === answerVal);
        if (match) {
          score += 1;
        }
      });

      return {
        ...prod,
        score
      };
    });

    // Sort by score (descending), secondary sort by ID
    scoredProducts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.id - b.id;
    });

    // Top recommended product
    const recommendation = scoredProducts[0];
    const storeUrl = tenant.store_url.replace(/\/+$/, '');
    const checkoutUrl = `${storeUrl}/cart/add/?variant_id=${recommendation.variant_id}`;

    res.json({
      recommendation,
      checkoutUrl,
      debug: scoredProducts.map(p => ({ id: p.id, name: p.name, score: p.score }))
    });

  } catch (error) {
    console.error('Error calculating recommendation:', error);
    res.status(500).json({ error: 'Error interno del motor de recomendación.', details: error.message });
  }
});

// --- ADMIN / MERCHANT API ---

/**
 * GET /api/admin/config
 */
app.get('/api/admin/config', async (req, res) => {
  const { store_id } = req.query;
  if (!store_id) return res.status(400).json({ error: 'Falta store_id.' });

  try {
    const tenant = await dbGet('SELECT * FROM tenants WHERE store_id = ?', [store_id]);
    if (!tenant) return res.status(404).json({ error: 'Tienda no registrada.' });

    res.json({
      store_id: tenant.store_id,
      store_name: tenant.store_name,
      store_url: tenant.store_url,
      category: tenant.category,
      quiz_config: JSON.parse(tenant.quiz_config || '{}')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/config
 */
app.post('/api/admin/config', async (req, res) => {
  const { store_id } = req.query;
  const { category, quiz_config } = req.body;

  if (!store_id) return res.status(400).json({ error: 'Falta store_id.' });

  try {
    const tenant = await dbGet('SELECT * FROM tenants WHERE store_id = ?', [store_id]);
    if (!tenant) return res.status(404).json({ error: 'Tienda no registrada.' });

    let updatedCategory = tenant.category;
    let updatedConfig = JSON.parse(tenant.quiz_config || '{}');

    // If changing category, reset to default category template configuration
    if (category && category !== tenant.category) {
      updatedCategory = category;
      const template = templates[category] || templates.vinos;
      updatedConfig = {
        title: template.title,
        welcome_text: template.welcome_text,
        accent_color: template.theme.accent_color,
        background_color: template.theme.background_color,
        text_color: template.theme.text_color,
        button_text: template.theme.button_text
      };
    }

    // Merge manual text/style edits
    if (quiz_config) {
      updatedConfig = { ...updatedConfig, ...quiz_config };
    }

    await dbRun(
      'UPDATE tenants SET category = ?, quiz_config = ? WHERE store_id = ?',
      [updatedCategory, JSON.stringify(updatedConfig), store_id]
    );

    res.json({
      success: true,
      category: updatedCategory,
      quiz_config: updatedConfig
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/products
 */
app.get('/api/admin/products', async (req, res) => {
  const { store_id } = req.query;
  if (!store_id) return res.status(400).json({ error: 'Falta store_id.' });

  try {
    const products = await dbAll('SELECT * FROM products WHERE store_id = ?', [store_id]);
    const tags = await dbAll('SELECT * FROM product_tags WHERE store_id = ?', [store_id]);

    // Format tags mapping
    const productsWithTags = products.map(p => {
      const pTags = tags.filter(t => t.product_id === p.id).map(t => ({ key: t.tag_key, value: t.tag_value }));
      return {
        ...p,
        tags: pTags
      };
    });

    res.json(productsWithTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/products/sync
 * Sincroniza productos reales desde Tiendanube y corre el autoetiquetado
 */
app.post('/api/admin/products/sync', async (req, res) => {
  const { store_id } = req.query;
  if (!store_id) return res.status(400).json({ error: 'Falta store_id.' });

  try {
    const tenant = await dbGet('SELECT * FROM tenants WHERE store_id = ?', [store_id]);
    if (!tenant) return res.status(404).json({ error: 'Tienda no registrada.' });

    // Ensure they have real credentials to sync from Tiendanube
    const access_token = tenant.access_token;
    if (!access_token || access_token.includes('mock')) {
      return res.status(400).json({ 
        error: 'Sincronización deshabilitada en modo demo.', 
        message: 'Para sincronizar productos reales de Tiendanube, debés instalar la app a través del flujo oficial de OAuth.' 
      });
    }

    console.log(`[Sync] Fetching products from Tiendanube for store ${store_id}...`);
    const tnProducts = await fetchStoreProducts(store_id, access_token);
    console.log(`[Sync] Found ${tnProducts.length} products in Tiendanube.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const p of tnProducts) {
      const tiendanube_id = String(p.id);
      const name = p.name.es || p.name.pt || p.name || '';
      const description = p.description.es || p.description.pt || p.description || '';
      
      // Get the variant_id of the first variant
      const firstVariant = p.variants && p.variants[0] ? p.variants[0] : null;
      const variant_id = firstVariant ? String(firstVariant.id) : null;
      const sku = firstVariant ? (firstVariant.sku || `sku-${tiendanube_id}`) : `sku-${tiendanube_id}`;
      const price = firstVariant ? firstVariant.price : '0.00';
      const canonical_url = p.canonical_url || '';
      const image_url = p.images && p.images[0] ? p.images[0].src : '';

      // Check if product already exists
      const existingProduct = await dbGet('SELECT id FROM products WHERE store_id = ? AND sku = ?', [store_id, sku]);

      let product_id;
      if (existingProduct) {
        product_id = existingProduct.id;
        await dbRun(
          `UPDATE products 
           SET tiendanube_id = ?, variant_id = ?, canonical_url = ?, name = ?, description = ?, image_url = ?, price = ?
           WHERE id = ?`,
          [tiendanube_id, variant_id, canonical_url, name, description, image_url, price, product_id]
        );
        updatedCount++;
      } else {
        const result = await dbRun(
          `INSERT INTO products (store_id, tiendanube_id, variant_id, canonical_url, name, description, image_url, price, sku)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [store_id, tiendanube_id, variant_id, canonical_url, name, description, image_url, price, sku]
        );
        product_id = result.lastID;
        createdCount++;
      }

      // Auto-tagging: run rules based on store active category
      const autoTags = autoTagProduct(name, description, tenant.category);

      // Delete existing tags for this product to avoid duplicates
      await dbRun('DELETE FROM product_tags WHERE store_id = ? AND product_id = ?', [store_id, product_id]);

      // Write new tags
      for (const t of autoTags) {
        try {
          await dbRun(
            `INSERT INTO product_tags (store_id, product_id, tag_key, tag_value)
             VALUES (?, ?, ?, ?)`,
            [store_id, product_id, t.key, t.value]
          );
        } catch (e) {
          // Ignore unique constraint fails
        }
      }
    }

    res.json({
      success: true,
      message: `Sincronización completa. Creados: ${createdCount}, Actualizados: ${updatedCount}.`
    });

  } catch (error) {
    console.error('[Sync] Error during product sync:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/products/tags
 * Guarda modificaciones manuales de etiquetas hechas por el comerciante
 */
app.post('/api/admin/products/tags', async (req, res) => {
  const { store_id } = req.query;
  const { product_id, tags } = req.body; // tags: [{ key: 'sabor', value: 'tinto' }, ...]

  if (!store_id || !product_id || !tags) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
  }

  try {
    // Verify product belongs to store
    const product = await dbGet('SELECT id FROM products WHERE store_id = ? AND id = ?', [store_id, product_id]);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Delete existing tags
    await dbRun('DELETE FROM product_tags WHERE store_id = ? AND product_id = ?', [store_id, product_id]);

    // Insert new tags
    for (const t of tags) {
      if (t.key && t.value) {
        await dbRun(
          `INSERT INTO product_tags (store_id, product_id, tag_key, tag_value)
           VALUES (?, ?, ?, ?)`,
          [store_id, product_id, t.key, t.value]
        );
      }
    }

    res.json({ success: true, message: 'Etiquetas actualizadas con éxito.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Smart Assistant Backend running on port ${PORT}`);
});
