import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";

await connectDB();

async function seed() {
    try {
        console.log("Clearing existing data");
        await Promise.all([
            User.deleteMany(),
            Employee.deleteMany(),
            Company.deleteMany(),
        ]);

        console.log("Creating company");
        const company = await Company.create({
            name: "TigerHR Inc.",
            address: "123 Main St, Springfield",
        });

        console.log("Creating users");
        const usersData = [
            { username: "admin", password: "adpass", role: "admin" },
            { username: "employee1", password: "emppass1", role: "user" },
            { username: "hr", password: "hrpass", role: "hr" },
        ];

        const createdUsers = [];
        for (const data of usersData) {
            const user = new User(data);
            await user.save();
            createdUsers.push(user);
        }
        console.log("Users created:", createdUsers.map(u => u.username).join(", "));

        console.log("Creating employee records");
        const employees= [
            {
                userId: createdUsers[0]._id, // admin
                companyId: company._id,
                position: "System Administrator",
                department: "IT",
                salary: 95000,
                email: "jdoe@tigerhr.com",
                dateHired: "01/01/2000",
                firstName: "Jane",
                lastName: "Doe",
                phoneNumber: 1111111111,
            },
            {
                userId: createdUsers[1]._id, // employee1
                companyId: company._id,
                position: "Software Engineer",
                department: "Development",
                salary: 75000,
                email: "jsmith@tigerhr.com",
                dateHired: "12/22/2022",
                firstName: "John",
                lastName: "Smith",
                phoneNumber: 2222222222,
            },
            {
                userId: createdUsers[2]._id, // hr
                companyId: company._id,
                position: "HR Manager",
                department: "Human Resources",
                salary: 85000,
                email: "rstone@tigerhr.com",
                dateHired: "11/11/2011",
                firstName: "Roger",
                lastName: "Stone",
                phoneNumber: 3333333333,
            },
        ];

        await Employee.insertMany(employees);

        console.log("Database seeded successfully");
        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
}

seed();
