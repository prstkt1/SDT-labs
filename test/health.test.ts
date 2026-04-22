import { Request, Response } from "express";
import { getAlive } from "../src/controllers/healthController";

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
});
