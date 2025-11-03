import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Allows us to reference to the user
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
    },
    salary: {
        type: Number,
        required: true,
    },
    dateHired: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

// We still need their name, email, phone, and manager/supervisors id

export default mongoose.model("Employee", employeeSchema);