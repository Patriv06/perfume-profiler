const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'smart_assistant.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper functions for async/await
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initial data to seed for test/demo stores
const seedTenants = [
  {
    store_id: '7732051', // Perfumes Demo
    store_name: 'Perfume Profiler Demo',
    store_url: 'https://testeoapps.mitiendanube.com',
    access_token: '5646080c3b8bcc54fc396bb6a3c45340a097ed29', // Live credentials for store 1
    category: 'perfumes',
    quiz_config: JSON.stringify({
      title: 'Encontrá tu Perfume Ideal',
      welcome_text: 'Respondé 3 simples preguntas y descubrí la fragancia perfecta para vos.',
      accent_color: '#D4AF37', // Gold
      background_color: '#111111',
      text_color: '#ffffff',
      button_text: 'Comenzar Trivia'
    })
  },
  {
    store_id: '9999999', // Wines Demo (Mock store for wine template demo)
    store_name: 'Vinos de Selección',
    store_url: 'https://vinos-demo.mitiendanube.com',
    access_token: 'mock-token-wines',
    category: 'vinos',
    quiz_config: JSON.stringify({
      title: 'Sommelier Virtual',
      welcome_text: '¿Buscando el vino perfecto? Te ayudamos a elegir el ideal para tu comida o reunión.',
      accent_color: '#722F37', // Wine / Burgundy
      background_color: '#1A1112',
      text_color: '#ffffff',
      button_text: 'Iniciar Consulta'
    })
  }
];

const seedProducts = [
  // Perfumes Products
  {
    store_id: '7732051',
    name: 'Blue Seduction for Men',
    description: 'Una fragancia fresca y sensual, perfecta para el día a día. Destaca por sus notas chispeantes de menta y melón.',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    price: '25000.00',
    sku: 'BSD-M-01',
    variant_id: 'mock-variant-bsd-m-01',
    canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-bsd-m-01',
    tags: [
      { key: 'gender', value: 'Hombre' },
      { key: 'moment', value: 'Día' },
      { key: 'note', value: 'Cítrico' }
    ]
  },
  {
    store_id: '7732051',
    name: 'The Golden Secret',
    description: 'Un perfume misterioso, elegante y sumamente seductor pensado para la noche.',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    price: '28000.00',
    sku: 'TGS-M-02',
    variant_id: 'mock-variant-tgs-m-02',
    canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-tgs-m-02',
    tags: [
      { key: 'gender', value: 'Hombre' },
      { key: 'moment', value: 'Noche' },
      { key: 'note', value: 'Amaderado' }
    ]
  },
  {
    store_id: '7732051',
    name: 'Queen of Seduction',
    description: 'Una fragancia ultra femenina y fresca ideal para el día con notas cítricas y acuáticas.',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    price: '26000.00',
    sku: 'QOS-F-01',
    variant_id: 'mock-variant-qos-f-01',
    canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-qos-f-01',
    tags: [
      { key: 'gender', value: 'Mujer' },
      { key: 'moment', value: 'Día' },
      { key: 'note', value: 'Floral' }
    ]
  },
  {
    store_id: '7732051',
    name: 'Her Secret Temptation',
    description: 'Un perfume oriental floral, dulce y sumamente cautivador para noches inolvidables.',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    price: '29000.00',
    sku: 'HST-F-02',
    variant_id: 'mock-variant-hst-f-02',
    canonical_url: 'https://testeoapps.mitiendanube.com/productos/mock-hst-f-02',
    tags: [
      { key: 'gender', value: 'Mujer' },
      { key: 'moment', value: 'Noche' },
      { key: 'note', value: 'Oriental' }
    ]
  },

  // Wine Products
  {
    store_id: '9999999',
    name: 'Malbec Gran Reserva 2021',
    description: 'Vino tinto con cuerpo e intenso. Perfecto para acompañar carnes rojas asadas y asados con amigos. Crianza en barricas francesas.',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
    price: '18500.00',
    sku: 'WNE-MAL-01',
    variant_id: 'mock-variant-wne-mal-01',
    canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-mal-01',
    tags: [
      { key: 'sabor', value: 'tinto' },
      { key: 'maridaje', value: 'carnes' },
      { key: 'ocasion', value: 'asado' },
      { key: 'ocasion', value: 'cena' }
    ]
  },
  {
    store_id: '9999999',
    name: 'Chardonnay Estate Colección',
    description: 'Vino blanco fresco y ligero, con notas a manzana verde y durazno blanco. Ideal para pescados y mariscos, o para relajar después de una larga tarde.',
    image_url: 'https://images.unsplash.com/photo-1569919650476-f542182470f1?auto=format&fit=crop&q=80&w=600',
    price: '12400.00',
    sku: 'WNE-CHA-02',
    variant_id: 'mock-variant-wne-cha-02',
    canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-cha-02',
    tags: [
      { key: 'sabor', value: 'blanco' },
      { key: 'maridaje', value: 'pescados' },
      { key: 'ocasion', value: 'relax' }
    ]
  },
  {
    store_id: '9999999',
    name: 'Blend Selección Premium Canto',
    description: 'Vino tinto de corte de uvas seleccionadas. Una botella elegante ideal para regalar o para una cena romántica y formal.',
    image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=600',
    price: '31000.00',
    sku: 'WNE-BLD-03',
    variant_id: 'mock-variant-wne-bld-03',
    canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-bld-03',
    tags: [
      { key: 'sabor', value: 'tinto' },
      { key: 'maridaje', value: 'carnes' },
      { key: 'maridaje', value: 'pastas' },
      { key: 'ocasion', value: 'cena' },
      { key: 'ocasion', value: 'regalo' }
    ]
  },
  {
    store_id: '9999999',
    name: 'Rosé Tardío Dulce Natural',
    description: 'Un rosado sumamente refrescante, dulce y frutado. Combina a la perfección con picadas, quesos de todo tipo o fiambres.',
    image_url: 'https://images.unsplash.com/photo-1553184920-f80868a29db7?auto=format&fit=crop&q=80&w=600',
    price: '9800.00',
    sku: 'WNE-ROS-04',
    variant_id: 'mock-variant-wne-ros-04',
    canonical_url: 'https://vinos-demo.mitiendanube.com/productos/mock-wne-ros-04',
    tags: [
      { key: 'sabor', value: 'rosado' },
      { key: 'maridaje', value: 'quesos' },
      { key: 'ocasion', value: 'relax' }
    ]
  }
];

// Initialize DB schema
const initDatabase = async () => {
  try {
    // 1. Create tenants table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS tenants (
        store_id TEXT PRIMARY KEY,
        store_name TEXT,
        store_url TEXT,
        access_token TEXT,
        category TEXT DEFAULT 'vinos',
        quiz_config TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create products table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id TEXT,
        tiendanube_id TEXT,
        variant_id TEXT,
        canonical_url TEXT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        price TEXT,
        sku TEXT,
        FOREIGN KEY (store_id) REFERENCES tenants(store_id) ON DELETE CASCADE,
        UNIQUE(store_id, sku)
      )
    `);

    // 3. Create product_tags table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS product_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id TEXT,
        product_id INTEGER,
        tag_key TEXT NOT NULL,
        tag_value TEXT NOT NULL,
        FOREIGN KEY (store_id) REFERENCES tenants(store_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(store_id, product_id, tag_key, tag_value)
      )
    `);

    console.log('Database tables verified/created.');

    // 4. Seeding Demo Stores
    const tenantsCount = await dbGet('SELECT COUNT(*) as count FROM tenants');
    if (tenantsCount.count === 0) {
      console.log('Seeding demo tenants...');
      for (const t of seedTenants) {
        await dbRun(
          `INSERT INTO tenants (store_id, store_name, store_url, access_token, category, quiz_config)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [t.store_id, t.store_name, t.store_url, t.access_token, t.category, t.quiz_config]
        );
      }

      console.log('Seeding demo products and tags...');
      for (const p of seedProducts) {
        // Insert product
        await dbRun(
          `INSERT INTO products (store_id, name, description, image_url, price, sku, variant_id, canonical_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.store_id, p.name, p.description, p.image_url, p.price, p.sku, p.variant_id, p.canonical_url]
        );

        // Get inserted product ID
        const insertedProd = await dbGet('SELECT id FROM products WHERE store_id = ? AND sku = ?', [p.store_id, p.sku]);
        const product_id = insertedProd.id;

        // Insert tags
        for (const t of p.tags) {
          await dbRun(
            `INSERT INTO product_tags (store_id, product_id, tag_key, tag_value)
             VALUES (?, ?, ?, ?)`,
            [p.store_id, product_id, t.key, t.value]
          );
        }
      }
      console.log('Database seeded successfully.');
    } else {
      console.log('Found existing tenants. Skipping seed.');
    }

  } catch (err) {
    console.error('Error during database initialization:', err.message);
  }
};

module.exports = {
  db,
  dbRun,
  dbAll,
  dbGet,
  initDatabase
};
