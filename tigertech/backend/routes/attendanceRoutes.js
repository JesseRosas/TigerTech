import express from "express";
import { createAttendance, getAttendance, updateAttendance, deleteAttendance, getAttendanceByEmployeeId } from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // won't put in right now to make testing routes easy

const router = express.Router();

router.post("/", createAttendance);

router.get("/", getAttendance, authMiddleware);
router.get("/:employeeId", getAttendanceByEmployeeId, authMiddleware);
router.delete("/:id", deleteAttendance, authMiddleware);
router.put("/:id", updateAttendance, authMiddleware);

export default router;