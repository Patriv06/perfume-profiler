const express = require('express');
const axios = require('axios');
const router = express.Router();
const { dbRun, dbGet, widgetConfigCache } = require('./db');
const { registerStorefrontScript } = require('./tiendanube');
const templates = require('./templates');

const CLIENT_ID = process.env.TIENDANUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.TIENDANUBE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:5001';

/**
 * Endpoint called by Tiendanube during app installation.
 * Receives 'code' query parameter.
 */
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorización faltante.');
  }

  try {
    console.log('[Auth] Exchanging authorization code for access token...');
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.tiendanube.com/apps/authorize/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code
    }, {
      headers: {
        'User-Agent': `SmartShoppingAssistant (${CLIENT_ID})`
      }
    });

    const { access_token, user_id } = tokenResponse.data;
    const store_id = String(user_id);

    console.log(`[Auth] Token obtained successfully for store ID: ${store_id}`);

    // Fetch store details to get name and URL
    let storeName = `Tienda ${store_id}`;
    let storeUrl = 'https://mitiendanube.com';
    try {
      const storeResponse = await axios.get(`https://api.tiendanube.com/v1/${store_id}`, {
        headers: {
          'Authentication': `bearer ${access_token}`,
          'User-Agent': `SmartShoppingAssistant (${CLIENT_ID})`
        }
      });
      storeName = storeResponse.data.name.es || storeResponse.data.name.pt || storeResponse.data.name || storeName;
      storeUrl = storeResponse.data.main_domain || storeResponse.data.url || storeUrl;
    } catch (err) {
      console.warn('[Auth] Failed to fetch store details, using defaults:', err.message);
    }

    // Check if tenant already exists
    const existingTenant = await dbGet('SELECT * FROM tenants WHERE store_id = $1', [store_id]);
    
    if (existingTenant) {
      // Update token and details
      await dbRun(
        'UPDATE tenants SET store_name = $1, store_url = $2, access_token = $3 WHERE store_id = $4',
        [storeName, storeUrl, access_token, store_id]
      );
      console.log(`[Auth] Updated existing tenant: ${store_id}`);
    } else {
      // Create new tenant with default 'vinos' template
      const defaultTemplate = templates.vinos;
      await dbRun(
        'INSERT INTO tenants (store_id, store_name, store_url, access_token, category, quiz_config) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          store_id,
          storeName,
          storeUrl,
          access_token,
          'vinos',
          JSON.stringify({
            title: defaultTemplate.title,
            welcome_text: defaultTemplate.welcome_text,
            accent_color: defaultTemplate.theme.accent_color,
            background_color: defaultTemplate.theme.background_color,
            text_color: defaultTemplate.theme.text_color,
            button_text: defaultTemplate.theme.button_text
          })
        ]
      );
      console.log(`[Auth] Created new tenant: ${store_id}`);
    }

    // Invalidate cache for this tenant
    widgetConfigCache.del(store_id);

    // Auto-inject script
    const scriptUrl = `${APP_URL}/widget.js`;
    try {
      await registerStorefrontScript(store_id, access_token, scriptUrl);
      console.log(`[Auth] Auto-injected storefront script: ${scriptUrl}`);
    } catch (scriptErr) {
      console.error('[Auth] Failed to auto-inject script:', scriptErr.message);
    }

    // Redirect to the merchant dashboard inside our app, passing store_id as auth context
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?store_id=${store_id}`);

  } catch (error) {
    console.error('[Auth] OAuth Callback Error:', error.response ? error.response.data : error.message);
    res.status(500).send(`Error de autenticación: ${error.message}`);
  }
});

/**
 * Bypass / Mock Registration Endpoint for Development.
 * Allows setting up a store manually without going through the real Tiendanube Partner OAuth.
 */
router.post('/mock-register', async (req, res) => {
  const { store_id, access_token, store_name, store_url, category } = req.body;

  if (!store_id || !access_token) {
    return res.status(400).json({ error: 'Faltan store_id o access_token.' });
  }

  const activeCategory = category || 'vinos';
  const selectedTemplate = templates[activeCategory] || templates.vinos;

  try {
    const existingTenant = await dbGet('SELECT * FROM tenants WHERE store_id = $1', [store_id]);
    
    if (existingTenant) {
      await dbRun(
        'UPDATE tenants SET store_name = $1, store_url = $2, access_token = $3, category = $4 WHERE store_id = $5',
        [
          store_name || existingTenant.store_name,
          store_url || existingTenant.store_url,
          access_token,
          activeCategory,
          store_id
        ]
      );
      console.log(`[Auth Mock] Updated tenant: ${store_id}`);
    } else {
      await dbRun(
        'INSERT INTO tenants (store_id, store_name, store_url, access_token, category, quiz_config) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          store_id,
          store_name || `Tienda Mock ${store_id}`,
          store_url || 'https://testeoapps.mitiendanube.com',
          access_token,
          activeCategory,
          JSON.stringify({
            title: selectedTemplate.title,
            welcome_text: selectedTemplate.welcome_text,
            accent_color: selectedTemplate.theme.accent_color,
            background_color: selectedTemplate.theme.background_color,
            text_color: selectedTemplate.theme.text_color,
            button_text: selectedTemplate.theme.button_text
          })
        ]
      );
      console.log(`[Auth Mock] Registered new tenant: ${store_id}`);
    }

    // Invalidate cache for this tenant
    widgetConfigCache.del(store_id);

    // Try script injection if not dummy token
    if (access_token && !access_token.includes('mock')) {
      const scriptUrl = `${APP_URL}/widget.js`;
      try {
        await registerStorefrontScript(store_id, access_token, scriptUrl);
        console.log(`[Auth Mock] Injected storefront script: ${scriptUrl}`);
      } catch (scriptErr) {
        console.warn('[Auth Mock] Script injection skipped or failed:', scriptErr.message);
      }
    }

    res.json({ success: true, message: `Tenant ${store_id} registrado/actualizado con éxito.` });

  } catch (error) {
    console.error('[Auth Mock] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/webhooks/charge
 * Webhook called by Tiendanube when subscription charge is updated.
 */
router.post('/webhooks/charge', async (req, res) => {
  const { event, store_id, status } = req.body;
  
  console.log(`[Webhook] Received charge event: ${event} for store: ${store_id}, status: ${status}`);

  if (!store_id) {
    return res.status(400).json({ error: 'Falta store_id en el payload.' });
  }

  try {
    // If status is paid/active/approved, mark as active. Otherwise, mark as inactive.
    // Tiendanube charge statuses: "pending", "paid", "unpaid", "voided", "refunded"
    let billingStatus = 'inactive';
    if (status === 'paid' || status === 'active' || status === 'approved') {
      billingStatus = 'active';
    }

    await dbRun(
      'UPDATE tenants SET billing_status = $1 WHERE store_id = $2',
      [billingStatus, String(store_id)]
    );

    // Invalidate cache for this tenant
    widgetConfigCache.del(String(store_id));

    console.log(`[Webhook] Updated billing_status to: ${billingStatus} for store: ${store_id}`);
    res.json({ success: true, billing_status: billingStatus });
  } catch (error) {
    console.error('[Webhook] Error updating billing status via webhook:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
