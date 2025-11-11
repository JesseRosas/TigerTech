import mongoose from "mongoose";

const dispRecordsSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: false,
        },
        type: {
            type: String,
            enum: ["warning", "write-up", "other"],
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Allows us to reference to the user
            required: false,
        },
        dateIssued: {
            type: Date,
            default: Date.now,
            required: false,
        },
        resolved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Disciplinary Records", dispRecordsSchema);