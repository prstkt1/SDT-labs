import { Request, Response } from "express";
import pool from "../db/index-db";

export const getAllNotes = async (req: Request, res: Response) => {
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
      html += `</table><br><a href="/">На головну</a></body></html>`;
      return res.send(html);
    }
    return res.json(notes);
  } catch (error) {
    console.error("Помилка отримання нотаток:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

export const createNote = async (req: Request, res: Response) => {
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
    console.error("Помилка створення нотатки:", error);
    res.status(500).json({ error: "Помилка при створенні нотатки" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
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
        </html>`;
      return res.send(html);
    }
    return res.json(note);
  } catch (error) {
    console.error(`Помилка отримання нотатки ${id}:`, error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};
