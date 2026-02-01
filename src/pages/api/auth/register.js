import { getDb, saveDb } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDb();
    
    // VULNERABLE: Direct string interpolation - SQL Injection possible
    const checkQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const checkStmt = db.prepare(checkQuery);
    let existingUser = null;
    if (checkStmt.step()) {
      existingUser = checkStmt.getAsObject();
    }
    checkStmt.free();
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // VULNERABLE: Direct string interpolation
    const insertQuery = `INSERT INTO users (email, password, first_name, last_name) VALUES ('${email}', '${hashedPassword}', '${firstName || ''}', '${lastName || ''}')`;
    
    try {
      db.run(insertQuery);
      saveDb();
      
      const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
      
      // Create session
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      db.run('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)', [lastId, token, expiresAt]);
      saveDb();
      
      res.status(201).json({
        token,
        user: {
          id: lastId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          isAdmin: false
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
