import express from "express";
import {createEmployee, getEmployees, deleteEmployee, updateEmployee} from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createEmployee);
router.get("/", authMiddleware, getEmployees);
router.delete("/:id", authMiddleware, deleteEmployee);
router.put("/:id", authMiddleware, updateEmployee);

export default router;