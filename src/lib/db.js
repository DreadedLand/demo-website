const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.db');

let db = null;
let SQL = null;

async function getDb() {
  if (db) return db;
  
  if (!SQL) {
    SQL = await initSqlJs();
  }
  
  // Try to load existing database
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Wrapper to make sql.js work more like better-sqlite3
function prepare(db, sql) {
  return {
    run: (...params) => {
      db.run(sql, params);
      saveDb();
      const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
      return { lastInsertRowid: lastId };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const results = [];
      const stmt = db.prepare(sql);
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  };
}

module.exports = { getDb, saveDb, prepare };
