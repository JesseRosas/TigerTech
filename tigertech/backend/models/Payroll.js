import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: false,
        },
        amount: {
            type: Number,

        },
        date: { // Date of pay
            type: Date,
            required: false,
        },
        hoursWorked: {
            type: Number,
            default: 0,
            required: false,
        },
        overtimeHours: {
            type: Number,
            default: 0,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Allows us to reference to the user
            required: false,
        },
        payStubUrl: { // Need to find out how to do this properly
            type: String,

        },
    },
    { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);