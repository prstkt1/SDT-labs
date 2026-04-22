import { Router } from "express";
import { getAlive, getReady } from "../controllers/healthController";

const router = Router();

router.get("/alive", getAlive);
router.get("/ready", getReady);

export default router;
