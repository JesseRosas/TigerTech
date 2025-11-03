import express from "express";
import cors from "cors";
// import mongoose from "mongoose";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);

app.listen(8080, () => console.log("Listening on port 8080"));