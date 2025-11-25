import {useEffect, useState} from "react";
import axios from "axios";


export function EmployeesContentMethods ({ role }) {
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        userId: "",
        password: "",
        role: "user",
        companyId: "",
        position: "",
        department: "",
        salary: "",
        email: "",
        dateHired: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (role === "hr" || role === "admin" || role === "manager") {
            fetchEmployees();
        }
    }, [role]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/companies", {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => setCompanies(res.data))
            .catch(err => console.error("Failed to fetch companies:", err));
    }, []);

    // This stuff should be handled by backend
    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
        const username = emp.userId?.username?.toLowerCase() || "";
        const dept = emp.department?.toLowerCase() || "";
        const pos = emp.position?.toLowerCase() || "";

        return (
            fullName.includes(searchQuery.toLowerCase())
            || username.includes(searchQuery.toLowerCase())
            || dept.includes(searchQuery.toLowerCase())
            || pos.includes(searchQuery.toLowerCase())
        );
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/api/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    // const handleAddEmployee = async (e) => {
    //     e.preventDefault();
    //     try {
    //         console.log("📤 Submitting employee:", newEmployee);
    //         await axios.post("http://localhost:8080/api/employees", newEmployee, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setNewEmployee({
    //             userId: "",
    //             companyId: "",
    //             position: "",
    //             department: "",
    //             salary: "",
    //             email: "",
    //             dateHired: "",
    //             firstName: "",
    //             lastName: "",
    //             phoneNumber: "",
    //             role: "user",
    //         });
    //         fetchEmployees();
    //     } catch (err) {
    //         console.error(err);
    //         setError("Error adding employee");
    //     }
    // };

    // Get me their ID if I give you a username
    const getUserIdFromUsername = async (username) => {
        try{
            const res = await axios.get(`http://localhost:8080/api/users/${username}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            return res.data._id;
        } catch (err) {
            console.error("Failed to get users ID: ", err);
            return null;
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try{
            let res;
            const userID = await getUserIdFromUsername(newEmployee.userId); // gets userId with username input

            // console.log("Tesing newEmployee id: ", newEmployee.userId);
            // console.log("userID is ", userID);

            if(!userID){ // Create a user
                res = await axios.post(`http://localhost:8080/api/users`,
                    {username: newEmployee.userId, password: newEmployee.password, role: newEmployee.role, email: newEmployee.email}
                );
            } else {
                res = {data: {_id: userID}}; // fake data if user
            }
            
            const attributes = {
                ...newEmployee,
                userId: res.data._id,
            };

            delete attributes.password;
            delete attributes.role;
            delete attributes.email;

            await axios.post(`http://localhost:8080/api/employees`,
                attributes,
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setNewEmployee({
                userId: "",
                password: "",
                role: "user",
                companyId: "",
                position: "",
                department: "",
                salary: "",
                email: "",
                dateHired: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
            });

            fetchEmployees();
        } catch (err) {
            console.error(err);
            setError("Error adding employee");
        }
    };

    // const handleDelete = async (id) => {
    //     if (!window.confirm("Are you sure you want to delete this employee?")) return;
    //     try {
    //         await axios.delete(`http://localhost:8080/api/employees/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         fetchEmployees();
    //     } catch (err) {
    //         console.error(err);
    //         setError("Error deleting employee");
    //     }
    // };

    const handleDelete = async (id) => {
        // console.log("Deleting employee with id =", id);

        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            const employee = await axios.get(`http://localhost:8080/api/employees/${id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );

            const userID = employee.data.userId?._id;

            if(userID){
                await axios.delete(`http://localhost:8080/api/users/${userID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            await axios.delete(`http://localhost:8080/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchEmployees();
        } catch (err) {
            console.error(err);
            setError("Error deleting employee");
        }
    };

    const handleEdit = (emp) => {
        setEditingEmployee(emp);
        setNewEmployee({
            userId: emp.userId?.username || "",
            password: emp.userId?.password || "",
            // username: emp.userId?.username || "",
            companyId: emp.companyId?._id || "",
            position: emp.position || "",
            department: emp.department || "",
            salary: emp.salary || "",
            email: emp.userId?.email || "",
            dateHired: emp.dateHired?.slice(0, 10) || "",
            firstName: emp.firstName || "",
            lastName: emp.lastName || "",
            phoneNumber: emp.phoneNumber || "",
            role: emp.userId?.role || "user",
        });
    };

    // const handleUpdateEmployee = async (e) => {
    //     e.preventDefault();
    //     try {
    //         console.log("Updating employee:", newEmployee);


    //         await axios.put(
    //             `http://localhost:8080/api/employees/${editingEmployee._id}`,
    //             newEmployee,
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             }
    //         );
    //         setEditingEmployee(null);
    //         setNewEmployee({
    //             userId: "",
    //             companyId: "",
    //             position: "",
    //             department: "",
    //             salary: "",
    //             email: "",
    //             dateHired: "",
    //             firstName: "",
    //             lastName: "",
    //             phoneNumber: "",
    //             role: "user",
    //         });
    //         fetchEmployees();
    //     } catch (err) {
    //         console.error(err);
    //         setError("Error updating employee");
    //     }
    // };

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        try {
            console.log("Updating employee:", newEmployee);

            const userID = editingEmployee.userId?._id;

            const userData = {
                username: newEmployee.userId, 
                role: newEmployee.role, 
                email: newEmployee.email,
            };

            if(newEmployee.password){
                userData.password = newEmployee.password;
            }

            if(userID){
                await axios.put(
                    `http://localhost:8080/api/users/${userID}`,
                    userData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            const attributes = {...newEmployee};
            delete attributes.userId;
            delete attributes.password;
            delete attributes.role;
            delete attributes.email;

            await axios.put(
                `http://localhost:8080/api/employees/${editingEmployee._id}`,
                attributes,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEditingEmployee(null);
            setNewEmployee({
                userId: "",
                // username: "",
                password: "",
                companyId: "",
                position: "",
                department: "",
                salary: "",
                email: "",
                dateHired: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                role: "user",
            });
            fetchEmployees();
        } catch (err) {
            console.error(err);
            setError("Error updating employee");
        }
    };

    const handleCancelEdit = () => {
        setEditingEmployee(null);
        setNewEmployee({
            userId: "",
            password: "",
            companyId: "",
            position: "",
            department: "",
            salary: "",
            email: "",
            dateHired: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
        });
    };

    if (role !== "hr" && role !== "admin" && role !== "manager") {
        return (
            <div>
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-5">Employee Management</h1>
            <p className="mb-6">View, add, and remove employee records.</p>

            <form
                onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
                className="bg-gray-100 p-4 rounded-lg mb-6 grid grid-cols-2 gap-4"
            >
                <input
                    type="text"
                    placeholder="Username"
                    value={newEmployee.userId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, userId: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="p-2 border rounded"
                    required
                >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={newEmployee.companyId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, companyId: e.target.value })}
                    className="p-2 border rounded"
                    required
                >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                            {company.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Position"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Phone Number"
                    value={newEmployee.phoneNumber}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="date"
                    placeholder="Date Hired"
                    value={newEmployee.dateHired}
                    onChange={(e) => setNewEmployee({ ...newEmployee, dateHired: e.target.value })}
                    className="p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    onClick={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
                    className="col-span-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded"
                >
                    {editingEmployee ? "Update Employee" : "Add Employee"}
                </button>
                {editingEmployee && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="col-span-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>


            {loading ? (
                <p>Loading employees...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Position</th>
                        <th className="border p-2">Department</th>
                        <th className="border p-2">Salary</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Hire Date</th>
                        <th className="border p-2">First Name</th>
                        <th className="border p-2">Last Name</th>
                        <th className="border p-2">Phone Number</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredEmployees.map((emp) => (
                        <tr key={emp._id}>
                            <td className="border p-2">{emp.userId?.username}</td>
                            <td className="border p-2">{emp.position}</td>
                            <td className="border p-2">{emp.department}</td>
                            <td className="border p-2">${emp.salary}</td>
                            <td className="border p-2">{emp.userId?.email}</td>
                            <td className="border p-2">{new Date(emp.dateHired).toLocaleDateString("en-US")}</td>
                            <td className="border p-2">{emp.firstName}</td>
                            <td className="border p-2">{emp.lastName}</td>
                            <td className="border p-2">{emp.phoneNumber}</td>
                            <td className="border p-2">{emp.userId?.role}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEdit(emp)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(emp._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};