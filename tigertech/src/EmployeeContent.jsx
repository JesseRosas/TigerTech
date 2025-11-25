import React, { useState, useEffect } from "react";

// Reusable Button Component
const Button = ({ children, primary = false, onClick, type = "button", className = "" }) => {
  const base = "font-bold py-3 px-5 rounded-lg shadow-sm transition-all active:scale-[.98] mr-3 mb-3";
  const primaryStyle = "bg-yellow-400 text-black border border-yellow-400 hover:bg-yellow-500";
  const defaultStyle = "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100";

  return (
    <button type={type} onClick={onClick} className={`${base} ${primary ? primaryStyle : defaultStyle} ${className}`}>
      {children}
    </button>
  );
};

// Input Component
const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
    />
  </div>
);

// Checkbox Component
const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-yellow-500 border-neutral-300 rounded"
    />
    <label className="ml-2 text-sm text-neutral-900">{label}</label>
  </div>
);

// Confirmation Modal
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="mb-6">{message}</p>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          primary
          onClick={onConfirm}
          className="bg-red-600 border-red-600 text-white hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

// Employee Modal - Add / Edit
const EmployeeFormModal = ({ onClose, onSave, employeeToEdit }) => {
  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
    position: "",
    department: "",
    salary: "",
    dateHired: "",
    active: true,
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (employeeToEdit) setFormData(employeeToEdit);
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {employeeToEdit ? "Edit Employee" : "Add New Employee"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <Input label="User ID" name="userId" value={formData.userId} onChange={handleChange} />
            <Input label="Company ID" name="companyId" value={formData.companyId} onChange={handleChange} />
            <Input label="Position" name="position" value={formData.position} onChange={handleChange} />
            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
            <Input label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            <Input label="Date Hired" name="dateHired" type="date" value={formData.dateHired} onChange={handleChange} />

            <div className="md:col-span-2">
              <Checkbox label="Active" name="active" checked={formData.active} onChange={handleCheckboxChange} />
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button primary type="submit">
              {employeeToEdit ? "Save Changes" : "Save Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Employee Directory Table
const EmployeeDirectory = ({ employees, onBack, onEdit, onDeleteRequest }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold">Employee Directory</h3>
      <Button onClick={onBack}>Back to Actions</Button>
    </div>

    {employees.length === 0 ? (
      <p>No employees have been added yet.</p>
    ) : (
      <div className="overflow-auto">
        <table className="w-full text-left border">
          <thead className="bg-neutral-50 border-b">
            <tr>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Position</th>
              <th className="p-3">Department</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-neutral-50">
                <td className="p-3">{emp.firstName}</td>
                <td className="p-3">{emp.lastName}</td>
                <td className="p-3">{emp.userId}</td>
                <td className="p-3">{emp.position}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">{emp.phoneNumber}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button onClick={() => onEdit(emp)} className="text-yellow-600">Edit</button>
                    <button onClick={() => onDeleteRequest(emp.id)} className="text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// --- MAIN EmployeesContent Component ---
const EmployeesContent = ({ employees, setEmployees }) => {
  const [currentView, setCurrentView] = useState("actions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  // Filter for search
  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const saveEmployee = (data) => {
    if (data.id) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === data.id ? data : e))
      );
    } else {
      setEmployees((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const deleteEmployee = () => {
    setEmployees((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Employee Management</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <input
          className="p-2 border rounded-md"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {currentView === "actions" && (
        <>
          <p className="mb-6 text-neutral-700">Manage employee profiles and directory.</p>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap">
              <Button primary onClick={openAdd}>Add New Employee</Button>
              <Button primary onClick={() => setCurrentView("directory")}>View Directory</Button>
            </div>
          </div>
        </>
      )}

      {currentView === "directory" && (
        <EmployeeDirectory
          employees={filtered}
          onBack={() => setCurrentView("actions")}
          onEdit={openEdit}
          onDeleteRequest={setDeleteId}
        />
      )}

      {isModalOpen && (
        <EmployeeFormModal
          employeeToEdit={editingEmployee}
          onClose={() => setIsModalOpen(false)}
          onSave={saveEmployee}
        />
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Employee"
          message="Are you sure you want to delete this employee?"
          onCancel={() => setDeleteId(null)}
          onConfirm={deleteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesContent;
