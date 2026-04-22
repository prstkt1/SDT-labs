import { Request, Response } from "express";
import {
  getAllNotes,
  createNote,
  getNoteById,
} from "../src/controllers/notesController";
import pool from "../src/db/index-db";

jest.mock("../src/db/index-db", () => ({
  query: jest.fn(),
}));

describe("Notes Controller", () => {
  it("getAllNotes повинен повертати список нотаток у форматі JSON", async () => {
    const mockNotes = [{ id: 1, title: "Test Note" }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockNotes });

    const req = {
      accepts: jest.fn().mockReturnValue("json"),
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getAllNotes(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, title FROM notes ORDER BY id ASC",
    );
    expect(res.json).toHaveBeenCalledWith(mockNotes);
  });
  it("createNote повинен створювати нотатку і повертати статус 201", async () => {
    const req = {
      body: { title: "Нова нотатка", content: "Текст нотатки" },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockCreatedNote = {
      id: 2,
      title: "Нова нотатка",
      content: "Текст нотатки",
    };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockCreatedNote] });

    await createNote(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreatedNote);
  });
  it("getNoteById повинен повертати нотатку за ID у форматі JSON", async () => {
    const req = {
      params: { id: "1" },
      accepts: jest.fn().mockReturnValue("json"),
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const mockNote = {
      id: 1,
      title: "Test",
      content: "Text",
      created_at: "2023-01-01",
    };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockNote] });

    await getNoteById(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, title, created_at, content FROM notes WHERE id = $1",
      ["1"],
    );
    expect(res.json).toHaveBeenCalledWith(mockNote);
  });

  it("getNoteById повинен повертати статус 404, якщо нотатку не знайдено", async () => {
    const req = {
      params: { id: "999" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await getNoteById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Нотатку не знайдено");
  });
});
