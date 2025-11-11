import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Allows us to reference to the user
        required: false,
        default: null,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: false,
        default: null,
    },
    position: {
        type: String,
        required: false,
    },
    department: {
        type: String,
    },
    email: {
        type: String,
    },
    salary: {
        type: Number,
        required: false,
    },
    dateHired: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: Number,
        required: false
    }
}, {timestamps: true});

// We still need their name, email, phone, and manager/supervisors id

export default mongoose.model("Employee", employeeSchema);