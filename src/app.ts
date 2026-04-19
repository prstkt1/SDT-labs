import express, { Request, Response } from "express";
import config from "./config";
import healthRoutes from "./routes/health";
import notesRoutes from "./routes/notes";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/notes", notesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.type("html").send(`
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Notes API</title></head>
    <body>
        <h1>Notes Service API</h1>
        <ul>
            <li><a href="/health/alive">GET /health/alive</a> - Перевірка стану</li>
            <li><a href="/health/ready">GET /health/ready</a> - Перевірка БД</li>
            <li><a href="/notes">GET /notes</a> - Список усіх нотаток</li>
            <li>POST /notes - Створити нову нотатку</li>
            <li><a href="/notes/1">GET /notes/&lt;id&gt;</a> - Перегляд нотатки</li>
        </ul>
    </body>
    </html>
  `);
});

app.listen(config.port, () => {
  console.log(`Notes Service started!`);
  console.log(`http://localhost:${config.port}`);
});
