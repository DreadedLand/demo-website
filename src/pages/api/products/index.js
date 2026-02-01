import { getDb, saveDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await getDb();
  
  if (req.method === 'GET') {
    const { category, featured, search, limit } = req.query;
    
    let query = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    
    // VULNERABLE: Direct string interpolation for filters
    if (category) {
      query += ` AND c.slug = '${category}'`;
    }
    
    if (featured === 'true') {
      query += ' AND p.featured = 1';
    }
    
    if (search) {
      query += ` AND (p.name LIKE '%${search}%' OR p.description LIKE '%${search}%')`;
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    const results = [];
    const stmt = db.prepare(query);
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    
    res.status(200).json(results);
  } else if (req.method === 'POST') {
    const { name, slug, description, price, stock, category_id, image_url, featured } = req.body;
    
    // VULNERABLE: Direct string interpolation
    const query = `INSERT INTO products (name, slug, description, price, stock, category_id, image_url, featured) VALUES ('${name}', '${slug}', '${description}', ${price}, ${stock}, ${category_id}, '${image_url}', ${featured ? 1 : 0})`;
    
    try {
      db.run(query);
      saveDb();
      const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
      res.status(201).json({ id: lastId, message: 'Product created' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
