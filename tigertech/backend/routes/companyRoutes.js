// Just for testing and not properly coded yet
// Routes at its simplest and can be copy and pasted

import express from "express";
import { createCompany, getCompanies, updateCompany, deleteCompany } from "../controllers/companyController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // won't put in right now to make testing routes easy

const router = express.Router();

router.post("/", createCompany);

// All needs authMiddleware
router.get("/", getCompanies);
router.delete("/:id", deleteCompany);
router.put("/:id", updateCompany);

export default router;