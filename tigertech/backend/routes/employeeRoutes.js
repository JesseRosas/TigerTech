import express from "express";
import {createEmployee, getEmployees, deleteEmployee, updateEmployee, getEmployeeById} from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/:id", authMiddleware, getEmployeeById);
router.delete("/:id", authMiddleware, deleteEmployee);
router.put("/:id", authMiddleware, updateEmployee);

export default router;