import express from "express";
import { createUser, loginUser, updateUser, getUsers, deleteUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);

router.get("/", authMiddleware, getUsers);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/:id", authMiddleware, updateUser);

export default router;