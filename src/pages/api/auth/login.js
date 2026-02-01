import { getDb, saveDb } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDb();
    
    // VULNERABLE: Direct string interpolation - SQL Injection possible
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const stmt = db.prepare(query);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = bcrypt.compareSync(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    db.run('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, token, expiresAt]);
    saveDb();
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin === 1
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
