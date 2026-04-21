import { Request, Response } from "express";
import pool from "../db";

export const getAlive = (req: Request, res: Response) => {
  res.status(200).send("OK");
};

export const getReady = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    res.status(200).send("OK");
  } catch (error) {
    console.error("Помилка з'єднання з БД:", error);
    res.status(500).send("Помилка: Сервіс не має доступу до бази даних");
  }
};
