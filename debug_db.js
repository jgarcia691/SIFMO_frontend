const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function debug() {
    const dbPath = path.resolve('/home/gerencia_de_telematica/Documentos/Pasantia Jose/SIFMO_backend/SIFMO.db');
    console.log("Checking DB at:", dbPath);
    
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log("\n--- SCHEMA INCIDENTE ---");
        const schemaI = await db.all("PRAGMA table_info(Incidente)");
        console.log(JSON.stringify(schemaI, null, 2));

        console.log("\n--- SCHEMA USUARIO ---");
        const schemaU = await db.all("PRAGMA table_info(Usuario)");
        console.log(JSON.stringify(schemaU, null, 2));

        console.log("\n--- RECENT INCIDENTS ---");
        const incidents = await db.all("SELECT id, encargado, status FROM Incidente ORDER BY id DESC LIMIT 5");
        console.log(JSON.stringify(incidents, null, 2));

        console.log("\n--- ANALYST DATA ---");
        const analyst = await db.all("SELECT ficha, nombre, correo, numero FROM Usuario WHERE ficha = 777");
        console.log(JSON.stringify(analyst, null, 2));

    } catch (err) {
        console.error("Error:", err);
    }
}

debug();
