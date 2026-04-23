const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../SIFMO_backend/SIFMO.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.each("SELECT sql FROM sqlite_master WHERE type='table' AND name='usuario'", (err, row) => {
    console.log("usuario schema:", row.sql);
  });
  
  db.each("SELECT sql FROM sqlite_master WHERE type='table' AND name='area'", (err, row) => {
    console.log("area schema:", row.sql);
  });

  db.all("SELECT * FROM area", (err, rows) => {
    console.log("Areas:", rows);
  });
});

db.close();
