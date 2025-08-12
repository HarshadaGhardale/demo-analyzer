import express from "express";
import { submitContact } from "../controller/contactController.js";

const router = express.Router();

// POST request to handle contact form submissions
router.post("/", submitContact);

export default router;