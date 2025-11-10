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

// Still need to find a way to link an employee to their manager or supervisor
// Maybe give them another employee's id to connect them and front end checks them? (won't add until pretty sure)

export default mongoose.model("Employee", employeeSchema);