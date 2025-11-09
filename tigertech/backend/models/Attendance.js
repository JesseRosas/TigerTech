import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: false,
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
        required: false,
    },
    status: {
        type: String,
        enum: ["approved", "pending", "denied"],
        default: "pending",
        required: false,
    },
    notes: {
        type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);