// Just for testing and not properly coded yet
// CRUD at its simplest and can be copy and pasted for all tables

import Company from "../models/Company.js";

// All functions need validation of what role user is
// Only currently testing company as employee needs to be employed to one to be properly sorted later

// Who can create a company? user? hr? admin?
export const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

// Does the user care to see all companies?
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// Should hr or management be allowed to update company information?
export const updateCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Manager and admin the only ones who can delete a company?
export const deleteCompany = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.json({message: "Company deleted"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};