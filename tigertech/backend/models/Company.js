import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
            unique: true
        },
        address: {
            type: String
        },
    },
    { timestamps: true }
);

export default mongoose.model("Company", companySchema);