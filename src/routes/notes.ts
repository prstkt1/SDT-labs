import { Router } from "express";
import { getAllNotes, createNote, getNoteById } from "../controllers/notes";

const router = Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.get("/:id", getNoteById);

export default router;
