import React, { useState, useEffect, useRef } from 'react';

// --- 1. Header Component (Modified for Logout Dropdown) ---
const Header = ({ onLogout, username }) => { // <-- Receive username prop
  // State to manage if the dropdown is open or closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for click-outside-to-close

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    // Only add listener if dropdown is open
    if (!isDropdownOpen) return;

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup function to remove the listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]); // Re-run effect if isDropdownOpen changes

  return (
    <header className="[grid-area:header] bg-neutral-900 text-white flex justify-between items-center px-8 border-b-4 border-yellow-400">
      <div className="text-2xl font-bold">TigerHR</div>
      
      {/* Dropdown container */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          className="text-white bg-transparent border-none cursor-pointer p-2 rounded-md hover:bg-neutral-700 transition-colors"
        >
          {/* Use the username prop, capitalize it, and fallback to 'User' */}
          Welcome, {username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User'}
          {/* Simple dropdown arrow */}
          <span className="ml-2">&#9662;</span> 
        </button>

        {/* The dropdown menu itself */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// --- 2. Sidebar Component ---
const Sidebar = ({ activePage, setActivePage }) => {
  // Add "Attendance" and "Payroll" to the nav items
  const navItems = ['Employees', 'Time Off', 'Attendance', 'Payroll', 'Reports', 'Settings'];

  return (
    <nav className="[grid-area:sidebar] bg-white border-r border-neutral-200 pt-5">
      <ul>
        {navItems.map((item) => {
          const isActive = activePage === item;
          
          return (
            <li key={item} className="list-none">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item);
                }}
                className={`
                  block py-4 px-8 no-underline text-base font-bold transition-all
                  border-l-4
                  ${isActive
                    ? 'text-yellow-500 border-l-yellow-500 bg-yellow-50'
                    : 'text-neutral-800 border-l-transparent hover:bg-neutral-100'
                  }
                `}
              >
                {item}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// --- 3. Content Area Component ---
const ContentArea = ({ activePage, employees, setEmployees }) => {
  
  // Pass employees and setEmployees to EmployeesContent
  const contentProps = {
    Employees: { employees, setEmployees },
  };

  return (
    <main className="[grid-area:content] p-8 overflow-y-auto bg-neutral-100">
      {activePage === 'Employees' && <EmployeesContent {...contentProps.Employees} />}
      {activePage === 'Time Off' && <TimeOffContent />}
      {activePage === 'Attendance' && <AttendanceContent />}
      {activePage === 'Payroll' && <PayrollContent />}    
      {activePage === 'Reports' && <ReportsContent />}
      {activePage === 'Settings' && <SettingsContent />}
    </main>
  );
};


// --- Reusable Quick Actions Widget ---
const QuickActionsWidget = ({ children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
    <div className="flex flex-wrap">
      {children}
    </div>
  </div>
);

// --- Confirmation Modal (NEW) ---
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm z-50">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-neutral-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <Button type="button" onClick={onCancel}>Cancel</Button>
          <Button primary type="button" onClick={onConfirm} className="bg-red-600 hover:bg-red-700 border-red-600 text-white">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};


// --- Page Content Components (UPDATED) ---

// --- Employees Content (Heavily Modified) ---
const EmployeesContent = ({ employees, setEmployees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [currentView, setCurrentView] = useState('actions'); // 'actions' or 'directory'
  const [editingEmployee, setEditingEmployee] = useState(null); // Holds employee to edit
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null); // Holds employee ID to delete

  // Function to save (add or update) an employee
  const handleSaveEmployee = (employeeData) => {
    if (employeeData.id) {
      // This is an update
      setEmployees(prev => 
        prev.map(emp => emp.id === employeeData.id ? employeeData : emp)
      );
    } else {
      // This is a new employee
      const employeeWithId = { ...employeeData, id: Date.now() };
      setEmployees(prev => [...prev, employeeWithId]);
    }
    setIsModalOpen(false); // Close modal on save
    setEditingEmployee(null); // Clear editing state
  };
  
  // Function to open the edit modal
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };
  
  // Function to open the add modal
  const handleAddClick = () => {
    setEditingEmployee(null); // Ensure no employee is being edited
    setIsModalOpen(true);
  };

  // Function to handle the actual deletion
  const handleDeleteEmployee = () => {
    if (deletingEmployeeId) {
      setEmployees(prev => prev.filter(emp => emp.id !== deletingEmployeeId));
      setDeletingEmployeeId(null); // Close confirm modal
    }
  };

  // Main render logic for this component
  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Employee Management</h1>
      
      {/* VIEW 1: Quick Actions */}
      {currentView === 'actions' && (
        <>
          <p className="mb-6">Manage employee profiles, search the directory, and onboard new hires.</p>
          <QuickActionsWidget>
            <Button primary onClick={handleAddClick}>Add New Employee</Button>
            <Button primary onClick={() => setCurrentView('directory')}>View Directory</Button>
            <Button primary>Search Employees</Button>
          </QuickActionsWidget>
        </>
      )}

      {/* VIEW 2: Employee Directory */}
      {currentView === 'directory' && (
        <EmployeeDirectory 
          employees={employees} 
          onBack={() => setCurrentView('actions')}
          onEdit={handleEditClick} // Pass down edit function
          onDeleteRequest={setDeletingEmployeeId} // Pass down delete request function
        />
      )}

      {/* The modal is rendered here but only visible when isModalOpen is true */}
      {isModalOpen && (
        <EmployeeFormModal
          employeeToEdit={editingEmployee}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }} 
          onSave={handleSaveEmployee}
        />
      )}
      
      {/* The confirmation modal for deletion */}
      {deletingEmployeeId && (
        <ConfirmModal
          title="Delete Employee"
          message="Are you sure you want to delete this employee record? This action cannot be undone."
          onConfirm={handleDeleteEmployee}
          onCancel={() => setDeletingEmployeeId(null)}
        />
      )}
    </div>
  );
};

// --- Employee Directory (UPDATED) ---
const EmployeeDirectory = ({ employees, onBack, onEdit, onDeleteRequest }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Employee Directory</h3>
        <Button onClick={onBack}>Back to Actions</Button>
      </div>
      
      {employees.length === 0 ? (
        <p className="text-neutral-600">No employees have been added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                <th className="p-3 whitespace-nowrap">First Name</th>
                <th className="p-3 whitespace-nowrap">Last Name</th>
                <th className="p-3 whitespace-nowrap">User ID</th>
                <th className="p-3 whitespace-nowrap">Company ID</th>
                <th className="p-3 whitespace-nowrap">Position</th>
                <th className="p-3 whitespace-nowrap">Department</th>
                <th className="p-3 whitespace-nowrap">Phone</th>
                <th className="p-3 whitespace-nowrap">Date Hired</th>
                <th className="p-3 whitespace-nowrap">Salary</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="p-3 whitespace-nowrap">{emp.firstName || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.lastName || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.userId || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.companyId || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.position || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.department || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.phoneNumber || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.dateHired || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{emp.salary ? `$${Number(emp.salary).toLocaleString()}` : 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      emp.active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* Edit Button (Pencil Icon) */}
                      <button 
                        onClick={() => onEdit(emp)} 
                        title="Edit"
                        className="p-1 text-neutral-600 hover:text-yellow-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      {/* Delete Button (Trash Icon) */}
                      <button 
                        onClick={() => onDeleteRequest(emp.id)} 
                        title="Delete"
                        className="p-1 text-neutral-600 hover:text-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
};

// --- Add Employee Modal (Renamed and UPDATED) ---
const EmployeeFormModal = ({ onClose, onSave, employeeToEdit }) => {
  const [formData, setFormData] = useState({
    userId: '',
    companyId: '',
    position: '',
    department: '',
    salary: '',
    dateHired: '',
    active: true,
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  // Pre-fill form if we are editing
  useEffect(() => {
    if (employeeToEdit) {
      setFormData(employeeToEdit);
    }
  }, [employeeToEdit]);

  // Generic handler for all text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for the checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass the local state (which has .id if editing)
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        <h2 className="text-2xl font-bold mb-4">
          {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <Input label="User ID" name="userId" value={formData.userId} onChange={handleChange} />
            <Input label="Company ID" name="companyId" value={formData.companyId} onChange={handleChange} />
            <Input label="Position" name="position" value={formData.position} onChange={handleChange} />
            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
            <Input label="Salary" name="salary" value={formData.salary} onChange={handleChange} type="number" />
            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" />
            <Input label="Date Hired" name="dateHired" value={formData.dateHired} onChange={handleChange} type="date" />
            
            <div className="md:col-span-2">
              <Checkbox label="Active" name="active" checked={formData.active} onChange={handleCheckboxChange} />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end mt-6 pt-4 border-t border-neutral-200">
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button primary type="submit">
              {employeeToEdit ? 'Save Changes' : 'Save Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Form Helper: Input (NEW) ---
const Input = ({ label, name, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
    />
  </div>
);

// --- Form Helper: Checkbox (NEW) ---
const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-yellow-500 border-neutral-300 rounded focus:ring-yellow-400"
    />
    <label className="ml-2 block text-sm text-neutral-900" htmlFor={name}>
      {label}
    </label>
  </div>
);


// --- Other Content Pages (Unchanged) ---

const TimeOffContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Time Off</h1>
    <p className="mb-6">Submit time off requests, view balances, and manage team approvals.</p>
    <QuickActionsWidget>
      <Button primary>Request Time Off</Button>
      <Button primary>View My Balances</Button>
      <Button primary>Team Calendar</Button>
      <Button primary>Pending Approvals</Button>
    </QuickActionsWidget>
  </div>
);

const AttendanceContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Attendance</h1>
    <p className="mb-6">View timesheets, manage clock-in/out data, and approve hours.</p>
    <QuickActionsWidget>
      <Button primary>My Timesheet</Button>
      <Button primary>Approve Timesheets</Button>
      <Button primary>View Attendance Log</Button>
      <Button primary>Correct a Punch</Button>
    </QuickActionsWidget>
  </div>
);

const PayrollContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Payroll</h1>
    <p className="mb-6">Process payroll, manage employee compensation, and view history.</p>
    {/* These buttons match the user's screenshot */}
    <QuickActionsWidget>
      <Button primary>Run Payroll</Button>
      <Button primary>Edit Payroll</Button>
      <Button primary>Payroll History</Button>
      <Button primary>Paystubs</Button>
    </QuickActionsWidget>
  </div>
);

const ReportsContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Reports</h1>
    <p className="mb-6">Generate and export reports for headcount, payroll, and attendance.</p>
    <QuickActionsWidget>
      <Button primary>Run Headcount Report</Button>
      <Button primary>Run Payroll Report</Button>
      <Button primary>Run Attendance Report</Button>
      <Button primary>Export Data</Button>
    </QuickActionsWidget>
  </div>
);

const SettingsContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Settings</h1>
    <p className="mb-6">Manage system settings, user permissions, and integrations.</p>
    <QuickActionsWidget>
      <Button primary>Manage User Roles</Button>
      <Button primary>Company Settings</Button>
      <Button primary>Manage Integrations</Button>
    </QuickActionsWidget>
  </div>
);

// --- Reusable Button Component (UPDATED) ---
// Added mb-3 to handle vertical spacing when buttons wrap
// Updated to always use primary (gold) style
const Button = ({ children, primary = false, onClick, type = 'button', className = '' }) => {
  const baseClasses = "font-bold py-3 px-5 rounded-lg shadow-sm transition-all active:scale-[.98] mr-3 mb-3";
  const primaryClasses = "bg-yellow-400 text-black border border-yellow-400 hover:bg-yellow-500";
  // Added a default/secondary style for the 'Cancel' button
  const defaultClasses = "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100";
  
  // Combine base classes, primary/default classes, and any custom classes passed in
  const combinedClasses = `${baseClasses} ${primary ? primaryClasses : defaultClasses} ${className}`;

  return (
    <button 
      type={type}
      onClick={onClick}
      className={combinedClasses}
    >
      {children}
    </button>
  );
};

// --- 4. Main Application Component (Holds Dashboard Layout) ---
// This was the old 'App' component. It now gets rendered *by* App.
const MainApp = ({ onLogout, username, employees, setEmployees }) => { // <-- Receive username, employees, setEmployees
  const [activePage, setActivePage] = useState('Employees'); // <-- Default to Employees

  return (
    <div 
      className="h-screen min-w-[1200px] min-h-[700px] grid grid-rows-[60px_1fr] grid-cols-[240px_1fr] [grid-template-areas:_'header_header'_'sidebar_content']"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Pass the onLogout function and username to the Header */}
      <Header onLogout={onLogout} username={username} />
      
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      
      {/* Pass employees state down to ContentArea */}
      <ContentArea 
        activePage={activePage} 
        employees={employees}
        setEmployees={setEmployees}
      />
    </div>
  );
};

// --- 5. Login Screen Component (UPDATED) ---
// This component is shown when the user is not authenticated.
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const loginSuccess = onLogin(username, password);
    
    if (!loginSuccess) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-neutral-900" /* Dark background */
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="bg-neutral-800 p-10 rounded-lg shadow-lg w-full max-w-sm border-t-4 border-yellow-400"> {/* Dark card with gold border */}
        <h1 className="text-3xl font-bold text-center mb-2 text-yellow-400">TigerHR</h1> {/* Gold title */}
        <p className="text-center text-neutral-300 mb-6">Please sign in to continue</p> {/* Lighter grey text */}
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-600 text-white px-4 py-3 rounded-md mb-4 text-sm" role="alert"> {/* Darker red error */}
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-neutral-300 text-sm font-bold mb-2" htmlFor="username"> {/* Lighter label */}
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm appearance-none border border-neutral-600 rounded-md w-full py-3 px-4 bg-neutral-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400" /* Dark input, white text, gold focus */
              // Removed placeholder text
            />
          </div>
          <div className="mb-6">
            <label className="block text-neutral-300 text-sm font-bold mb-2" htmlFor="password"> {/* Llighter label */}
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-neutral-600 rounded-md w-full py-3 px-4 bg-neutral-700 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400" /* Dark input, white text, gold focus */
              // Removed placeholder text
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- 6. Top-Level App Component (NEW - Handles Auth) ---
// This is now the main component that decides what to show.
export default function App() {
  // State to track if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to store the current user's name
  const [currentUser, setCurrentUser] = useState(null);
  // State for employees, "lifted" to the top level
  const [employees, setEmployees] = useState([]);

  // Login function to pass to the LoginScreen
  const handleLogin = (username, password) => {
    // Check credentials
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setCurrentUser(username); // <-- Store the username
      return true; // Login successful
    }
    return false; // Login failed
  };

  // Logout function to pass to the MainApp
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null); // <-- Clear the username on logout
  };

  // Conditional rendering:
  // If authenticated, show MainApp.
  // Otherwise, show LoginScreen.
  return (
    <div className="App">
      {isAuthenticated ? (
        <MainApp 
          onLogout={handleLogout} 
          username={currentUser}
          employees={employees}      // Pass state down
          setEmployees={setEmployees}  // Pass setter down
        />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}