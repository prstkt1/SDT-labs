import express, { Request, Response } from "express";
import { Pool } from "pg";
import fs from "fs";

let config: any;
try {
  config = JSON.parse(fs.readFileSync("/etc/mywebapp/config.json", "utf-8"));
} catch (err) {
  config = require("../config.json");
}

const app = express();

app.use(express.json());

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

app.get("/", (req: Request, res: Response) => {
  res.type("html").send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Notes API</title></head>
        <body>
            <h1>Notes Service API</h1>
            <ul>
                <li><a href="/health/alive">GET /health/alive</a> - Перевірка стану (завжди 200 OK)</li>
                <li><a href="/health/ready">GET /health/ready</a> - Перевірка БД</li>
                <li><a href="/notes">GET /notes</a> - Список усіх нотаток</li>
                <li>POST /notes - Створити нову нотатку (потрібен JSON: title, content)</li>
                <li><a href="/notes/1">GET /notes/&lt;id&gt;</a> - Перегляд конкретної нотатки</li>
            </ul>
        </body>
        </html>
    `);
});

app.get("/health/alive", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/health/ready", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Помилка: Сервіс не має доступу до бази даних");
  }
});

app.get("/notes", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, title FROM notes ORDER BY id ASC",
    );
    const notes = result.rows;

    if (req.accepts(["json", "html"]) === "html") {
      let html = `
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"><title>Нотатки</title></head>
                <body>
                    <h1>Список нотаток</h1>
                    <table border="1">
                        <tr><th>ID</th><th>Title</th></tr>`;

      notes.forEach((note) => {
        html += `<tr><td>${note.id}</td><td><a href="/notes/${note.id}">${note.title}</a></td></tr>`;
      });

      html += `
                    </table>
                    <br><a href="/">На головну</a>
                </body>
                </html>`;
      return res.send(html);
    }

    return res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.post("/notes", async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Поля title та content є обов'язковими" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Помилка при створенні нотатки" });
  }
});

app.get("/notes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, title, created_at, content FROM notes WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Нотатку не знайдено");
    }

    const note = result.rows[0];

    if (req.accepts(["json", "html"]) === "html") {
      const html = `
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"><title>${note.title}</title></head>
                <body>
                    <h1>Нотатка #${note.id}: ${note.title}</h1>
                    <p><strong>Створено:</strong> ${note.created_at}</p>
                    <p><strong>Вміст:</strong></p>
                    <div style="border: 1px solid black; padding: 10px;">${note.content}</div>
                    <br><a href="/notes">Назад до списку</a>
                </body>
                </html>
            `;
      return res.send(html);
    }

    return res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.listen(config.port, () => {
  console.log(`Notes Service started!`);
  console.log(`http://localhost:${config.port}`);
});
