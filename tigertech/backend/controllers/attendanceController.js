import Attendance from "../models/Attendance.js";

// Does not need to be too complex
// The frontend will handle if user is admin, hr, or just a user

// We don't care about copies since someone can report multiple sick days with the same user
export const createAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

export const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find();
        res.json(attendance);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


// This is the filter endpoint
// This gets all attendances by the same employee
// If you need an employee's sick days or vacations then use this
export const getAttendanceByEmployeeId = async (req, res) => {
    try {
        // Go in then filter the whole thing by the employee's id
        const employeeId = req.params.employeeId;
        const attendance = await Attendance.find({employeeId});
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const {employeeId, clockIn, clockOut, type, status, notes} = req.body;

        const updateFields = {};

        if(employeeId) updateFields.employeeId = employeeId;
        if(clockIn) updateFields.clockIn = clockIn;
        if(clockOut) updateFields.clockOut = clockOut;
        if(type) updateFields.type = type;
        if(status) updateFields.status = status;
        if(notes) updateFields.notes = notes;

        const attendance = await Attendance.findByIdAndUpdate(req.params.id, updateFields, {new: true, runValidators: true});

        if(!attendance) return res.status(404).json({error: "Attendance not found"});
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteAttendance = async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({message: "Attendance deleted"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};