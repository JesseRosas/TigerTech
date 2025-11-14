import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

// Things that might need to added
// Need a way to get one specific user by ID (only admin maybe?)
// getUsers needs to give a user their own information and no one elses unless its an admin
// Since we login with a email then maybe we switch login with username to email?

export const createUser = async (req, res) => {
    const {username, password, role, email, employeeId} = req.body;

    try {
        const userExist = await User.findOne({username});
        if(userExist){
            return res.status(400).json({message: "User already exist"});
        }

        // double hash?
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

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

        const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        // We only delete a user if its an admin account or yourself
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

        let isMatch = false;

        //Try bcrypt compare first
        try {
            console.log("Login attempt:", username, "Stored hash:", user.password);
            isMatch = await bcrypt.compare(password, user.password);
        } catch (e) {
            isMatch = false;
        }

        //If bcrypt compare fails, fall back to plain-text match
        if (!isMatch && user.password === password) {
            console.warn(`⚠️ User ${username} still using plaintext password. Rehashing now...`);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword;
            await user.save();

            isMatch = true;
        }
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