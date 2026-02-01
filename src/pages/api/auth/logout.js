import { getDb, saveDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const db = await getDb();
      db.run(`DELETE FROM sessions WHERE token = '${token}'`);
      saveDb();
    }
    
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
