import { getDb, saveDb } from '../../../lib/db';

// Helper to run select and return all results
function getAll(db, query) {
  const results = [];
  const stmt = db.prepare(query);
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper to run select and return first result
function getOne(db, query) {
  const stmt = db.prepare(query);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

// SECRET ADMIN API - NO AUTHENTICATION REQUIRED
export default async function handler(req, res) {
  const db = await getDb();
  
  if (req.method === 'GET') {
    const { type } = req.query;
    
    switch (type) {
      case 'users':
        const users = getAll(db, 'SELECT id, email, first_name, last_name, is_admin, created_at FROM users');
        return res.status(200).json(users);
        
      case 'orders':
        const orders = getAll(db, `
          SELECT o.*, u.email as user_email, u.first_name, u.last_name
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          ORDER BY o.created_at DESC
        `);
        return res.status(200).json(orders);
        
      case 'products':
        const products = getAll(db, 'SELECT * FROM products ORDER BY created_at DESC');
        return res.status(200).json(products);
        
      case 'stats':
        const totalUsers = getOne(db, 'SELECT COUNT(*) as count FROM users');
        const totalOrders = getOne(db, 'SELECT COUNT(*) as count FROM orders');
        const totalRevenue = getOne(db, 'SELECT SUM(total) as sum FROM orders WHERE status != "cancelled"');
        const totalProducts = getOne(db, 'SELECT COUNT(*) as count FROM products');
        const recentOrders = getAll(db, `
          SELECT o.*, u.email 
          FROM orders o 
          LEFT JOIN users u ON o.user_id = u.id 
          ORDER BY o.created_at DESC 
          LIMIT 5
        `);
        
        return res.status(200).json({
          totalUsers: totalUsers.count,
          totalOrders: totalOrders.count,
          totalRevenue: totalRevenue.sum || 0,
          totalProducts: totalProducts.count,
          recentOrders
        });
        
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } else if (req.method === 'POST') {
    const { action, data } = req.body;
    
    switch (action) {
      case 'update-order-status':
        db.run(`UPDATE orders SET status = '${data.status}' WHERE id = ${data.orderId}`);
        saveDb();
        return res.status(200).json({ message: 'Order status updated' });
        
      case 'toggle-admin':
        db.run(`UPDATE users SET is_admin = NOT is_admin WHERE id = ${data.userId}`);
        saveDb();
        return res.status(200).json({ message: 'Admin status toggled' });
        
      case 'delete-user':
        db.run(`DELETE FROM users WHERE id = ${data.userId}`);
        saveDb();
        return res.status(200).json({ message: 'User deleted' });
        
      case 'delete-product':
        db.run(`DELETE FROM products WHERE id = ${data.productId}`);
        saveDb();
        return res.status(200).json({ message: 'Product deleted' });
        
      case 'add-product':
        const { name, slug, description, price, stock, category_id, image_url, featured } = data;
        db.run(`INSERT INTO products (name, slug, description, price, stock, category_id, image_url, featured) VALUES ('${name}', '${slug}', '${description}', ${price}, ${stock}, ${category_id}, '${image_url}', ${featured ? 1 : 0})`);
        saveDb();
        return res.status(201).json({ message: 'Product added' });
        
      case 'update-product':
        const p = data;
        db.run(`UPDATE products SET name = '${p.name}', description = '${p.description}', price = ${p.price}, stock = ${p.stock}, category_id = ${p.category_id}, image_url = '${p.image_url}', featured = ${p.featured ? 1 : 0} WHERE id = ${p.id}`);
        saveDb();
        return res.status(200).json({ message: 'Product updated' });
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
