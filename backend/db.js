const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'perfumes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper functions to use async/await with sqlite3
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

// Initial test products data
const initialProducts = [
  {
    name: 'Blue Seduction for Men',
    description: 'Una fragancia fresca y sensual, perfecta para el día a día. Destaca por sus notas chispeantes de menta, bergamota y melón dulce, combinadas con acordes marinos y maderas cálidas.',
    gender: 'Hombre',
    moment: 'Día',
    note: 'Cítrico',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    price: '25000.00',
    sku: 'BSD-M-01'
  },
  {
    name: 'The Golden Secret',
    description: 'Un perfume misterioso, elegante y sumamente seductor pensado para la noche. Combina la frescura del licor de manzana con un corazón especiado de pimienta y nuez moscada, culminando en notas masculinas de cuero y madera.',
    gender: 'Hombre',
    moment: 'Noche',
    note: 'Amaderado',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    price: '28000.00',
    sku: 'TGS-M-02'
  },
  {
    name: 'Queen of Seduction',
    description: 'Una fragancia ultra femenina y fresca ideal para el día. Se abre con notas cítricas y acuáticas de pomelo y frambuesa, seguidas por un elegante corazón floral de jazmín y peonía, con un fondo sofisticado de sándalo y ámbar.',
    gender: 'Mujer',
    moment: 'Día',
    note: 'Floral',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    price: '26000.00',
    sku: 'QOS-F-01'
  },
  {
    name: 'Her Secret Temptation',
    description: 'Un perfume oriental floral, dulce y sumamente cautivador para noches inolvidables. Su aroma revela notas de salida de neroli y melocotón, un corazón apasionado de rosa y gardenia, y un fondo cálido de vainilla y pachulí.',
    gender: 'Mujer',
    moment: 'Noche',
    note: 'Oriental',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    price: '29000.00',
    sku: 'HST-F-02'
  }
];

// Initialize database schema and seed data
const initDatabase = async () => {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tiendanube_id TEXT,
        variant_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        gender TEXT CHECK(gender IN ('Hombre', 'Mujer', 'Unisex')),
        moment TEXT CHECK(moment IN ('Día', 'Noche')),
        note TEXT CHECK(note IN ('Cítrico', 'Amaderado', 'Floral', 'Oriental')),
        image_url TEXT,
        price TEXT,
        sku TEXT UNIQUE
      )
    `);

    // Check if products table is empty
    const rows = await dbAll('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('Seeding initial products into database...');
      for (const prod of initialProducts) {
        await dbRun(
          `INSERT INTO products (name, description, gender, moment, note, image_url, price, sku, variant_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            prod.name,
            prod.description,
            prod.gender,
            prod.moment,
            prod.note,
            prod.image_url,
            prod.price,
            prod.sku,
            // Pre-populate a fake variant_id in case Tiendanube API is not used/configured
            `mock-variant-${prod.sku.toLowerCase()}`
          ]
        );
      }
      console.log('Database seeded successfully.');
    } else {
      console.log('Database already initialized. Found existing products.');
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
