import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Create the user model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        select: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "hr", "manager"],
        default: "user"
    },
    email: {
        type: String,
        required: false
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },
}, {timestamps: true});

// Hashing the password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export for usage
export default mongoose.model("User", userSchema);