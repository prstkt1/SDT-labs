import { Client } from "pg";
import config from "./config";

async function runMigration() {
  const client = new Client({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
  });

  try {
    console.log("Підключення до бази даних...");
    await client.connect();

    console.log("Виконання міграції...");

    const query = `
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await client.query(query);
    console.log('Міграція успішно завершена! Таблиця "notes" готова.');
  } catch (error) {
    console.error("Помилка під час виконання міграції:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Відключення від бази даних.");
  }
}

runMigration();
