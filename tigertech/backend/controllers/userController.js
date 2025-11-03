import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

export const createUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        const userExist = await User.findOne({username});
        if(userExist){
            return res.status(400).json({message: "User already exist"});
        }

        const user = await User.create({username, password});
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

export const getUsers = async (req, res) => {
    try {
        const user = await User.find().select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateUser = async (req, res) => {
    try {
        if(req.user.id !== req.params.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to update this user" });
        }
        const updates = req.body;

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
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
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};