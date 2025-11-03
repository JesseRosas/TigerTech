import mongoose from "mongoose";

const dispRecordsSchema = new mongoose.Schema(
  {
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    type: {
        type: String,
        enum: ["warning", "write-up", "other"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Allows us to reference to the user
        required: true,
    },
    dateIssued: {
        type: Date,
        default: Date.now,
        required: true,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Disciplinary Records", dispRecordsSchema);