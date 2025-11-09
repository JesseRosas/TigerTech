import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

export const createUser = async (req, res) => {
    const {username, password, role, email, employeeId} = req.body;

    try {
        const userExist = await User.findOne({username});
        if(userExist){
            return res.status(400).json({message: "User already exist"});
        }

        const user = await User.create({username, password, role, email, employeeId});
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            employeeId: user.employeeId,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

export const getUsers = async (req, res) => {
    try {
        // Need to make it that only admins can see users and if not then you just get your user info
        // const user = await User.findById(req.body._id).select("-password"); // something like this
        const user = await User.find().select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateUser = async (req, res) => {
    try {
        const {username, role, email, employeeId, password} = req.body;

        if(req.user.id !== req.params.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to update this user" });
        }

        const updateFields = {}
        if (username) updateFields.username = username;
        if (role) updateFields.role = role;
        if (email) updateFields.email = email;
        if (employeeId) updateFields.employeeId = employeeId;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true, runValidators: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        // We only delete a user if its an admin account
        if (req.user.id !== req.params.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to delete this user" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({message: "User deleted"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // This uses username but can change to email if needed
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            employeeId: user.employeeId,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};