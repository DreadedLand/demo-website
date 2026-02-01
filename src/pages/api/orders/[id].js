import { getDb, saveDb } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await getDb();
  
  if (req.method === 'GET') {
    // VULNERABLE: Direct string interpolation
    const orderStmt = db.prepare(`SELECT * FROM orders WHERE id = ${id}`);
    let order = null;
    if (orderStmt.step()) {
      order = orderStmt.getAsObject();
    }
    orderStmt.free();
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const items = [];
    const itemsStmt = db.prepare(`
      SELECT oi.*, p.name, p.image_url, p.slug 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ${id}
    `);
    while (itemsStmt.step()) {
      items.push(itemsStmt.getAsObject());
    }
    itemsStmt.free();
    
    res.status(200).json({ ...order, items });
  } else if (req.method === 'PUT') {
    const { status } = req.body;
    
    // VULNERABLE: Direct string interpolation
    const query = `UPDATE orders SET status = '${status}' WHERE id = ${id}`;
    
    try {
      db.run(query);
      saveDb();
      res.status(200).json({ message: 'Order updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
