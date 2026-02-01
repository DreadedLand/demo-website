import { getDb, saveDb } from '../../../lib/db';

export default async function handler(req, res) {
  const { slug } = req.query;
  const db = await getDb();
  
  if (req.method === 'GET') {
    // VULNERABLE: Direct string interpolation
    const query = `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = '${slug}'`;
    const stmt = db.prepare(query);
    let product = null;
    if (stmt.step()) {
      product = stmt.getAsObject();
    }
    stmt.free();
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } else if (req.method === 'PUT') {
    const { name, description, price, stock, category_id, image_url, featured } = req.body;
    
    // VULNERABLE: Direct string interpolation
    const query = `UPDATE products SET name = '${name}', description = '${description}', price = ${price}, stock = ${stock}, category_id = ${category_id}, image_url = '${image_url}', featured = ${featured ? 1 : 0} WHERE slug = '${slug}'`;
    
    try {
      db.run(query);
      saveDb();
      res.status(200).json({ message: 'Product updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else if (req.method === 'DELETE') {
    // VULNERABLE: Direct string interpolation
    const query = `DELETE FROM products WHERE slug = '${slug}'`;
    
    try {
      db.run(query);
      saveDb();
      res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
