import mongoose from "mongoose";

// We do sick days through this but also clock in through this
// We can filter like clock in means type is work with no need for status

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true, // You need to provide an employees id
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