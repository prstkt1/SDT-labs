import { Request, Response } from "express";
import { getAlive, getReady } from "../src/controllers/healthController";
import pool from "../src/db/index-db";

jest.mock("../src/db/index-db", () => ({
  connect: jest.fn(),
}));

describe("Health Controller", () => {
  it("getAlive повинен повертати 200 OK", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    getAlive(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("OK");
  });

  it("getReady повинен успішно підключатися до БД і повертати 200 OK", async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);

    await getReady(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith("SELECT 1");
    expect(mockClient.release).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("OK");
  });
});
