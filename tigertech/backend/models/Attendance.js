import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    clockIn: { 
        type: Date,
        default: Date.now,
    },
    clockOut: { 
        type: Date
    },
    type: {
        type: String,
        enum: ["work", "vacation", "sick"],
        required: true,
    },
    status: {
        type: String,
        enum: ["approved", "pending", "denied"],
        default: "pending",
        required: true,
    },
    notes: {
        type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);