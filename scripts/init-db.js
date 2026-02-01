const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category_id INTEGER,
      image_url TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT,
      shipping_city TEXT,
      shipping_zip TEXT,
      shipping_country TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Database tables created successfully!');

  // Insert categories
  const categories = [
    { name: 'Guitars', slug: 'guitars', description: 'Acoustic and electric guitars for all skill levels', image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800' },
    { name: 'Pianos & Keyboards', slug: 'pianos-keyboards', description: 'Digital pianos, keyboards, and accessories', image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800' },
    { name: 'Drums & Percussion', slug: 'drums-percussion', description: 'Drum kits, cymbals, and percussion instruments', image_url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800' },
    { name: 'String Instruments', slug: 'string-instruments', description: 'Violins, cellos, and other string instruments', image_url: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800' },
    { name: 'Wind Instruments', slug: 'wind-instruments', description: 'Saxophones, trumpets, flutes, and more', image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800' },
    { name: 'Accessories', slug: 'accessories', description: 'Strings, picks, cases, and more', image_url: 'https://images.unsplash.com/photo-1558098329-a11cff621064?w=800' },
  ];

  categories.forEach(cat => {
    db.run('INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)', 
      [cat.name, cat.slug, cat.description, cat.image_url]);
  });

  console.log('Categories inserted!');

  // Insert products
  const products = [
    { name: 'Fender Stratocaster Elite', slug: 'fender-stratocaster-elite', description: 'The iconic Fender Stratocaster with premium pickups and hardware. Perfect for rock, blues, and everything in between.', price: 1899.99, stock: 15, category_id: 1, image_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800', featured: 1 },
    { name: 'Gibson Les Paul Standard', slug: 'gibson-les-paul-standard', description: 'The legendary Les Paul with rich, warm tone. A true classic for any serious guitarist.', price: 2499.99, stock: 8, category_id: 1, image_url: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=800', featured: 1 },
    { name: 'Martin D-28 Acoustic', slug: 'martin-d-28-acoustic', description: 'Premium solid wood acoustic guitar with exceptional tone and projection.', price: 3199.99, stock: 5, category_id: 1, image_url: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800', featured: 0 },
    { name: 'Taylor 814ce', slug: 'taylor-814ce', description: 'Grand Auditorium acoustic-electric with stunning rosewood back and sides.', price: 3999.99, stock: 4, category_id: 1, image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800', featured: 0 },
    { name: 'Ibanez RG550', slug: 'ibanez-rg550', description: 'High-performance electric guitar perfect for shredding and metal.', price: 999.99, stock: 12, category_id: 1, image_url: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800', featured: 0 },
    
    { name: 'Yamaha CFX Concert Grand', slug: 'yamaha-cfx-concert-grand', description: 'World-class concert grand piano with exceptional clarity and power.', price: 179999.99, stock: 2, category_id: 2, image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800', featured: 1 },
    { name: 'Roland RD-2000 Stage Piano', slug: 'roland-rd-2000', description: 'Professional stage piano with premium key action and sound engine.', price: 2799.99, stock: 7, category_id: 2, image_url: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=800', featured: 0 },
    { name: 'Nord Stage 3', slug: 'nord-stage-3', description: 'The ultimate performance keyboard for professionals.', price: 5499.99, stock: 4, category_id: 2, image_url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800', featured: 1 },
    { name: 'Kawai ES920', slug: 'kawai-es920', description: 'Portable digital piano with authentic grand piano feel.', price: 1599.99, stock: 10, category_id: 2, image_url: 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=800', featured: 0 },
    
    { name: 'DW Collectors Series Kit', slug: 'dw-collectors-kit', description: '5-piece drum kit with premium shells and hardware. Professional grade.', price: 5999.99, stock: 3, category_id: 3, image_url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800', featured: 1 },
    { name: 'Pearl Export Series', slug: 'pearl-export-series', description: 'Popular 5-piece kit perfect for beginners and intermediate players.', price: 799.99, stock: 15, category_id: 3, image_url: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=800', featured: 0 },
    { name: 'Roland TD-27KV Electronic Kit', slug: 'roland-td-27kv', description: 'Professional electronic drum kit with realistic feel and sound.', price: 3799.99, stock: 6, category_id: 3, image_url: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800', featured: 0 },
    { name: 'Zildjian A Custom Cymbal Pack', slug: 'zildjian-a-custom-pack', description: 'Complete cymbal pack with hi-hats, crashes, and ride.', price: 1299.99, stock: 8, category_id: 3, image_url: 'https://images.unsplash.com/photo-1461784180009-21121b2f204c?w=800', featured: 0 },
    
    { name: 'Stradivarius Replica Violin', slug: 'stradivarius-replica-violin', description: 'Handcrafted violin inspired by the legendary Stradivarius design.', price: 2499.99, stock: 5, category_id: 4, image_url: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800', featured: 1 },
    { name: 'Yamaha Silent Cello', slug: 'yamaha-silent-cello', description: 'Practice anywhere with this innovative silent cello.', price: 1899.99, stock: 4, category_id: 4, image_url: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800', featured: 0 },
    { name: 'NS Design Electric Violin', slug: 'ns-design-electric-violin', description: 'Modern electric violin for contemporary performers.', price: 2999.99, stock: 3, category_id: 4, image_url: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=800', featured: 0 },
    
    { name: 'Selmer Paris Alto Saxophone', slug: 'selmer-paris-alto-sax', description: 'Professional alto saxophone with legendary Selmer tone.', price: 7499.99, stock: 4, category_id: 5, image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', featured: 1 },
    { name: 'Bach Stradivarius Trumpet', slug: 'bach-stradivarius-trumpet', description: 'The gold standard in professional trumpets.', price: 3999.99, stock: 6, category_id: 5, image_url: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800', featured: 0 },
    { name: 'Yamaha YFL-677 Flute', slug: 'yamaha-yfl-677-flute', description: 'Professional silver flute with exceptional intonation.', price: 2899.99, stock: 7, category_id: 5, image_url: 'https://images.unsplash.com/photo-1619784299133-f691ffaea42f?w=800', featured: 0 },
    
    { name: 'Ernie Ball String Pack (12)', slug: 'ernie-ball-string-pack', description: '12 sets of premium electric guitar strings.', price: 59.99, stock: 100, category_id: 6, image_url: 'https://images.unsplash.com/photo-1558098329-a11cff621064?w=800', featured: 0 },
    { name: 'Boss DS-1 Distortion Pedal', slug: 'boss-ds1-distortion', description: 'Classic distortion pedal used by countless guitarists.', price: 69.99, stock: 25, category_id: 6, image_url: 'https://images.unsplash.com/photo-1527865118650-b28bc059d09a?w=800', featured: 0 },
    { name: 'Shure SM58 Microphone', slug: 'shure-sm58-mic', description: 'Industry-standard vocal microphone for live performance.', price: 99.99, stock: 30, category_id: 6, image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800', featured: 0 },
    { name: 'Fender Deluxe Guitar Case', slug: 'fender-deluxe-case', description: 'Hardshell case with plush interior for maximum protection.', price: 179.99, stock: 20, category_id: 6, image_url: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=800', featured: 0 },
  ];

  products.forEach(p => {
    db.run('INSERT INTO products (name, slug, description, price, stock, category_id, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [p.name, p.slug, p.description, p.price, p.stock, p.category_id, p.image_url, p.featured]);
  });

  console.log('Products inserted!');

  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run('INSERT INTO users (email, password, first_name, last_name, is_admin) VALUES (?, ?, ?, ?, ?)',
    ['admin@melodic.com', adminPassword, 'Admin', 'User', 1]);

  // Create test user
  const testPassword = bcrypt.hashSync('test123', 10);
  db.run('INSERT INTO users (email, password, first_name, last_name, is_admin) VALUES (?, ?, ?, ?, ?)',
    ['test@example.com', testPassword, 'Test', 'User', 0]);

  console.log('Users created!');

  // Save database to file
  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = path.join(__dirname, '..', 'database.db');
  fs.writeFileSync(dbPath, buffer);

  console.log('');
  console.log('=================================');
  console.log('Database initialized successfully!');
  console.log('=================================');
  console.log('');
  console.log('Admin credentials:');
  console.log('  Email: admin@melodic.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Test user credentials:');
  console.log('  Email: test@example.com');
  console.log('  Password: test123');
  console.log('');
  console.log('Secret admin panel: /secret-admin');
  console.log('');
}

initDatabase().catch(console.error);
