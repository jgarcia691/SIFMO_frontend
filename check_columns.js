const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function debug() {
    const dbPath = path.resolve('/home/gerencia_de_telematica/Documentos/Pasantia Jose/SIFMO_backend/SIFMO.db');
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const columns = await db.all("PRAGMA table_info(Incidente)");
        console.log("COLUMNS:", JSON.stringify(columns, null, 2));

    } catch (err) {
        console.error("Error:", err);
    }
}

debug();
