import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Company from "../models/Company.js";

export const createEmployee = async (req, res) => {
    try {
        const { userId, companyId, position, department, salary, dateHired, active, firstName, lastName, phoneNumber } = req.body;

        if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
            return res.status(403).json({ error: "Not authorized to create employees" });
        }

        // This is not needed right now, good for later when things are set though
        // if (!userId || !companyId || !position || !salary) {
        //     return res.status(400).json({ error: "Missing required fields" });
        // }

        // We are going to assume that to make an employee we have a user's id and a companies id and one user can only be one employee
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingCompany = await Company.findById(companyId);
        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        const existingEmployee = await Employee.findOne({ userId: userId });
        if (existingEmployee) {
            return res.status(400).json({ error: "This user is already an employee" });
        }

        const employee = await Employee.create({
            userId,
            companyId,
            position,
            department,
            salary,
            dateHired,
            active,
            firstName,
            lastName,
            phoneNumber,
        });
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};
/*
export const getEmployees = async (req, res) => {
    try {
        // Maybe make it so they get the employees under a certain company? (will do this later and maybe under a separate route)
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
}; */
// New getEmployees function
/*
export const getEmployees = async (req, res) => {
  try {
    const q = req.query.search ? req.query.search.trim() : null;

    let query = {};

    // If searc  is provided, build MongoDB regex query
    if (q) {
      const regex = { $regex: q, $options: "i" }; // case-insensitive search
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { position: regex },
        { department: regex }
      ];
    }

    let employees = []
    // HR/Admin can see all employees
if (req.user.role === "hr" || req.user.role === "admin" || req.user.role === "manager") {      const employees = await Employee.find(query)
        employees = await Employee.find(query)
        .populate("userId", "username email role")
        .populate("companyId", "name");

      return res.json(employees);
    }

    // Regular employee: only see own record
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate("userId", "username email role")
      .populate("companyId", "name");

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // If searching and the only employee doesn't match → return empty list
    if (q) {
      const match =
        employee.firstName?.toLowerCase().includes(q.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(q.toLowerCase()) ||
        employee.position?.toLowerCase().includes(q.toLowerCase()) ||
        employee.department?.toLowerCase().includes(q.toLowerCase());

      if (!match) return res.json([]);
    }

    return res.json(employee);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

export const getEmployees = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : "";

    let query = {};

    // If a search query exists, enable filtering
    if (search.length > 0) {
      const regex = { $regex: search, $options: "i" };

      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { position: regex },
        { department: regex },
        { phoneNumber: regex },
      ];
    }

    let employees = [];

    // HR/Admin/Manager → can see ALL employees
    if (
      req.user.role === "admin" ||
      req.user.role === "manager" ||
      req.user.role === "hr"
    ) {
      employees = await Employee.find(query)
        .populate("userId", "username email role")
        .populate("companyId", "name");
    } else {
      // Regular user — only return THEIR record
      employees = await Employee.find({
        userId: req.user._id,
        ...query,
      })
        .populate("userId", "username email role")
        .populate("companyId", "name");
    }

    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const updateEmployee = async (req, res) => {
    try {
        const { userId, companyId, position, department, salary, dateHired, active, firstName, lastName, phoneNumber } = req.body;

        if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
            return res.status(403).json({ error: "Not authorized to update employee" });
        }

        const updateFields = {};
        
        if (userId) updateFields.userId = userId;
        if (companyId) updateFields.companyId = companyId;
        if (position) updateFields.position = position;
        if (department) updateFields.department = department;
        if (salary) updateFields.salary = salary;
        if (dateHired) updateFields.dateHired = dateHired;
        if (active !== undefined) updateFields.active = active;
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        
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
        if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
            return res.status(403).json({ error: "Not authorized to delete employees" });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        res.json({message: "Employee deleted"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};