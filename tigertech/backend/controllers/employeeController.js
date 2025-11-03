import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Company from "../models/Company.js";

export const createEmployee = async (req, res) => {
    try {
        const { userId, companyId, position, department, salary } = req.body;

        if (req.user.role !== "hr" && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to create employees" });
        }

        if (!userId || !companyId || !position || !salary) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingCompany = await Company.findById(companyId);
        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        const existingEmployee = await Employee.findOne({ user: userId });
        if (existingEmployee) {
            return res.status(400).json({ error: "This user is already an employee" });
        }

        const employee = await Employee.create({
            user: userId,
            company: companyId,
            position,
            department,
            salary,
        });
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

export const getEmployees = async (req, res) => {
    try {
        if (req.user.role === "hr" || req.user.role === "admin") {
            const employees = await Employee.find().populate("user", "username role");
            res.json(employees);
        } else {
            const employee = await Employee.findOne({ user: req.user._id }).populate("user", "username role");
            if (!employee) return res.status(404).json({ error: "Employee not found" });
            res.json(employee);
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { position, department, salary, active } = req.body;

        if (req.user.role !== "hr" && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to update employee" });
        }

        const updateFields = {};
        if (position) updateFields.position = position;
        if (department) updateFields.department = department;
        if (salary) updateFields.salary = salary;
        if (active !== undefined) updateFields.active = active;
        
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if(!employee) return res.status(404).json({ error: "Employee not found" });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        if (req.user.role !== "hr" && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to delete employees" });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        res.json({message: "Employee deleted"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};