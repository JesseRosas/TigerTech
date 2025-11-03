import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    amount: {
        type: Number,

    },
    date: { // Date of pay
        type: Date,
        required: true,
    },
    hoursWorked: {
        type: Number,
        default: 0,
        required: true,
    },
    overtimeHours: {
        type: Number,
        default: 0,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Allows us to reference to the user
        required: true,
    },
    payStubUrl: { // Need to find out how to do this properly
        type: String,

    },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);