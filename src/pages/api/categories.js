import { getDb } from '../../lib/db';

export default async function handler(req, res) {
  const db = await getDb();
  
  if (req.method === 'GET') {
    const results = [];
    const stmt = db.prepare('SELECT * FROM categories');
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    res.status(200).json(results);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
