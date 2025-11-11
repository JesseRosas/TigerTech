import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
//import bcrypt from "bcryptjs";

export const createEmployee = async (req, res) => {
    try {
        console.log("createEmployee called with:", req.body);
        const { userId, companyId, position, department, salary, email, dateHired, firstName, lastName, phoneNumber, password, role: newRole } = req.body;

        if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
            return res.status(403).json({ error: "Not authorized to create employees" });
        }

        if (!["hr", "admin", "manager", "user"].includes(newRole)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        // This is not needed right now, good for later when things are set though
        // if (!userId || !companyId || !position || !salary) {
        //     return res.status(400).json({ error: "Missing required fields" });
        // }

        const existingCompany = await Company.findById(companyId);
        console.log("Company lookup result:", existingCompany);
        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        // We are going to assume that to make an employee we have a user's id and a companies id and one user can only be one employee
        let newUser = await User.findOne({ username: userId });

        if (newUser) {
            const existingEmployee = await Employee.findOne({ userId: newUser._id });

            console.log("Found user:", newUser.username);
            console.log("Stored password hash:", newUser.password);

            if (existingEmployee) {
                return res.status(400).json({ error: "This user is already an employee" });
            }

            newUser.role = newRole;

            if (password) {
                const isSamePassword = await bcrypt.compare(password, newUser.password);
                if (!isSamePassword) {
                    newUser.password = password;
                    console.log(`Password updated for existing user: ${newUser.username}`);
                }
            }

            await newUser.save();
            console.log(`Updated existing user: ${newUser.username} (${newUser.role})`);

        } else {
            //Create a new user
            newUser = await User.create({
                username: userId,
                password,
                role: newRole || "user",
            });
            console.log(`New user created: ${newUser.username} (${newUser.role})`);
        }

        const employee = await Employee.create({
            userId: newUser._id,
            companyId,
            position,
            department,
            salary,
            email,
            dateHired,
            firstName,
            lastName,
            phoneNumber,
        });

        const populatedEmployee = await employee.populate([
            { path: "userId", select: "username email role" },
            { path: "companyId", select: "name" }
        ]);

        res.status(201).json(populatedEmployee);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

export const getEmployees = async (req, res) => {
    try {
        if (req.user.role === "hr" || req.user.role === "admin" || req.user.role === "manager") {
            const employees = await Employee.find()
                .populate("userId", "username email role")
                .populate("companyId", "name");
            res.json(employees);
        } else {
            const employee = await Employee.findOne({ userId: req.user._id })
                .populate("userId", "username email role")
                .populate("companyId", "name");
            if (!employee) return res.status(404).json({ error: "Employee not found" });
            res.json(employee);
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { userId, companyId, position, department, salary, email, dateHired, active, firstName, lastName, phoneNumber, role, password } = req.body;

        if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
            return res.status(403).json({ error: "Not authorized to update employee" });
        }

        const updateFields = {};

        if (companyId) updateFields.companyId = companyId;
        if (position) updateFields.position = position;
        if (department) updateFields.department = department;
        if (salary) updateFields.salary = salary;
        if (email) updateFields.email = email;
        if (dateHired) updateFields.dateHired = dateHired;
        if (active !== undefined) updateFields.active = active;
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;

        if (userId) {
            let user = await User.findOne({ username: userId });

            if (!user) {
                // Create a new user if username doesn’t exist
                const hashedPassword = password
                    ? await bcrypt.hash(password, 10)
                    : await bcrypt.hash("default123", 10);

                user = await User.create({
                    username: userId,
                    password: hashedPassword,
                    role: role && ["user", "manager", "hr", "admin"].includes(role)
                        ? role
                        : "user",
                });
            } else {
                // Update role if changed
                if (role && ["user", "manager", "hr", "admin"].includes(role)) {
                    user.role = role;
                    await user.save();
                }
            }

            // Update employee reference to this user's _id
            updateFields.userId = user._id;
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        ).populate([
            { path: "userId", select: "username email role" },
            { path: "companyId", select: "name" },
        ]);

        if(!employee) return res.status(404).json({ error: "Employee not found" });
        res.json(employee);
    } catch (err) {
        console.error("Error in updateEmployee:", err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
            return res.status(403).json({ error: "Not authorized to delete employees" });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });

        if (employee.userId) {
            await User.findByIdAndDelete(employee.userId);
        }

        await Employee.findByIdAndDelete(req.params.id);

        res.json({ message: "Employee and linked user deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};