import { getDb, saveDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await getDb();
  
  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // VULNERABLE: Direct interpolation
    const sessionStmt = db.prepare(`SELECT * FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = '${token}'`);
    let session = null;
    if (sessionStmt.step()) {
      session = sessionStmt.getAsObject();
    }
    sessionStmt.free();
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    // Get user's orders
    const orders = [];
    const ordersStmt = db.prepare(`
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o 
      WHERE o.user_id = ${session.user_id}
      ORDER BY o.created_at DESC
    `);
    while (ordersStmt.step()) {
      orders.push(ordersStmt.getAsObject());
    }
    ordersStmt.free();
    
    res.status(200).json(orders);
  } else if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { items, shippingAddress, shippingCity, shippingZip, shippingCountry } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // VULNERABLE: Direct interpolation
    const sessionStmt = db.prepare(`SELECT * FROM sessions WHERE token = '${token}'`);
    let session = null;
    if (sessionStmt.step()) {
      session = sessionStmt.getAsObject();
    }
    sessionStmt.free();
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const prodStmt = db.prepare(`SELECT * FROM products WHERE id = ${item.productId}`);
      if (prodStmt.step()) {
        const product = prodStmt.getAsObject();
        total += product.price * item.quantity;
      }
      prodStmt.free();
    }
    
    // Create order - VULNERABLE
    const orderQuery = `INSERT INTO orders (user_id, total, shipping_address, shipping_city, shipping_zip, shipping_country) VALUES (${session.user_id}, ${total}, '${shippingAddress}', '${shippingCity}', '${shippingZip}', '${shippingCountry}')`;
    
    try {
      db.run(orderQuery);
      const orderIdStmt = db.prepare('SELECT last_insert_rowid() as id');
      orderIdStmt.step();
      const orderId = orderIdStmt.getAsObject().id;
      orderIdStmt.free();
      
      // Insert order items
      for (const item of items) {
        const prodStmt = db.prepare(`SELECT * FROM products WHERE id = ${item.productId}`);
        if (prodStmt.step()) {
          const product = prodStmt.getAsObject();
          db.run(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (${orderId}, ${item.productId}, ${item.quantity}, ${product.price})`);
          
          // Update stock
          db.run(`UPDATE products SET stock = stock - ${item.quantity} WHERE id = ${item.productId}`);
        }
        prodStmt.free();
      }
      
      saveDb();
      res.status(201).json({ orderId, total, message: 'Order created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
