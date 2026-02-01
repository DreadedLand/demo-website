import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const db = await getDb();
    
    // VULNERABLE: Direct string interpolation
    const query = `SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = '${token}'`;
    const stmt = db.prepare(query);
    let session = null;
    if (stmt.step()) {
      session = stmt.getAsObject();
    }
    stmt.free();
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }
    
    res.status(200).json({
      user: {
        id: session.user_id,
        email: session.email,
        firstName: session.first_name,
        lastName: session.last_name,
        isAdmin: session.is_admin === 1
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
