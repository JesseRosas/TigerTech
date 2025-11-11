import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { EmployeesContentMethods } from "./EmployeesContentMethods.jsx";

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
// (No changes from previous version)
const Sidebar = ({ activePage, setActivePage, role }) => {
  // Add "Attendance" and "Payroll" to the nav items
    const navItems = {
        admin: ["Attendance", "Employees", "Time Off", "Payroll", "Reports", "Settings"],
        hr: ["Attendance", "Employees", "Time Off",  "Payroll", "Reports"],
        user: ["Attendance", "Time Off", "Payroll"],
    };

  const items = navItems[role] || [];

  return (
    <nav className="[grid-area:sidebar] bg-white border-r border-neutral-200 pt-5">
      <ul>
        {items.map((item) => {
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
// (No changes from previous version)
const ContentArea = ({ activePage, role }) => {
    console.log("User role:", role, "Active page:", activePage);
    // Define which pages each role can access
    const allowedPages = {
        admin: ["Employees", "Time Off", "Attendance", "Payroll", "Reports", "Settings"],
        hr: ["Employees", "Time Off", "Attendance", "Payroll", "Reports"],
        user: ["Attendance", "Time Off", "Payroll"],
    };

    const isAllowed = allowedPages[role]?.includes(activePage);

    if (!isAllowed) {
        return (
            <main className="[grid-area:content] p-8 bg-neutral-100">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2 text-gray-700">
                    You do not have permission to view this page.
                </p>
            </main>
        );
    }

  return (
    <main className="[grid-area:content] p-8 overflow-y-auto bg-neutral-100">
        {activePage === "Attendance" && <AttendanceContent role={role} />}
        {activePage === "Employees" && <EmployeesContent role={role} />}
        {activePage === "Time Off" && <TimeOffContent role={role} />}
        {activePage === "Payroll" && <PayrollContent role={role} />}
        {activePage === "Reports" && <ReportsContent role={role} />}
        {activePage === "Settings" && <SettingsContent role={role} />}
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


// --- Page Content Components (UPDATED) ---

const EmployeesContent = ({ role }) => {
    // If HR or Admin, show the management table
    if (role === "hr" || role === "admin") {
        return <EmployeesContentMethods role={role} />;
    }

    // Otherwise, show limited info for employees
    return (
        <div>
            <h1 className="text-3xl font-bold mb-5">Employee Directory</h1>
            <p className="mb-6">View your personal information and department contacts.</p>
            <QuickActionsWidget>
                <Button>View My Info</Button>
                <Button>Department Directory</Button>
            </QuickActionsWidget>
        </div>
    );
};


const TimeOffContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Time Off</h1>
    <p className="mb-6">Submit time off requests, view balances, and manage team approvals.</p>
    <QuickActionsWidget>
      <Button primary>Request Time Off</Button>
      <Button>View My Balances</Button>
      <Button>Team Calendar</Button>
      <Button>Pending Approvals</Button>
    </QuickActionsWidget>
  </div>
);

const AttendanceContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Attendance</h1>
    <p className="mb-6">View timesheets, manage clock-in/out data, and approve hours.</p>
    <QuickActionsWidget>
      <Button primary>My Timesheet</Button>
      <Button>Approve Timesheets</Button>
      <Button>View Attendance Log</Button>
      <Button>Correct a Punch</Button>
    </QuickActionsWidget>
  </div>
);

const PayrollContent = ({ role }) => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Payroll</h1>
    <p className="mb-6">Manage payroll, manage employee compensation, and view history.</p>
    {/* These buttons match the user's screenshot */}
    <QuickActionsWidget>
        {(role !== "user") && (
            <>
                <Button primary>Run Payroll</Button>
                <Button primary>Edit Payroll</Button>
                <Button primary>Payroll History</Button>
            </>)}
      <Button primary>Paystubs</Button>
    </QuickActionsWidget>
  </div>
);

const ReportsContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Reports</h1>
    <p className="mb-6">Generate and export reports for headcount, payroll, and attendance.</p>
    <QuickActionsWidget>
      <Button>Run Headcount Report</Button>
      <Button>Run Payroll Report</Button>
      <Button>Run Attendance Report</Button>
      <Button>Export Data</Button>
    </QuickActionsWidget>
  </div>
);

const SettingsContent = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5">Settings</h1>
    <p className="mb-6">Manage system settings, user permissions, and integrations.</p>
    <QuickActionsWidget>
      <Button primary>Manage User Roles</Button>
      <Button>Company Settings</Button>
      <Button>Manage Integrations</Button>
    </QuickActionsWidget>
  </div>
);

// --- Reusable Button Component (UPDATED) ---
// Added mb-3 to handle vertical spacing when buttons wrap
// Updated to always use primary (gold) style
const Button = ({ children, primary = false }) => {
  const baseClasses = "font-bold py-3 px-5 rounded-lg shadow-sm transition-all active:scale-[.98] mr-3 mb-3";
  const primaryClasses = "bg-yellow-400 text-black border border-yellow-400 hover:bg-yellow-500";
  // const defaultClasses = "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100";

  return (
    <button className={`${baseClasses} ${primaryClasses}`}>
      {children}
    </button>
  );
};

// --- 4. Main Application Component (Holds Dashboard Layout) ---
// This was the old 'App' component. It now gets rendered *by* App.
const MainApp = ({ onLogout, username, role }) => { // <-- Receive username prop
  const [activePage, setActivePage] = useState('Attendance');

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
        role = {role}
      />

      <ContentArea activePage={activePage} role={role} />
    </div>
  );
};

// --- 5. Login Screen Component (UPDATED) ---
// This component is shown when the user is not authenticated.
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const success = await onLogin(username, password);
        if (!success) {
            setError("Invalid username or password");
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
  const [isAuthenticated, setIsAuthenticated] =useState(false);
  // State to store the current user's name
  const [currentUser, setCurrentUser] = useState(null);
  // State to track current user's role
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("username");

    if (token && storedRole && storedUser) {
        setIsAuthenticated(true);
        setUserRole(storedRole);
        setCurrentUser(storedUser);
    }
  }, []);


    // Login function to pass to the LoginScreen
  const handleLogin = async (username, password) => {
    // Check credentials
      try {
          const res = await axios.post("http://localhost:8080/api/users/login", {
              username,
              password,
          });

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("role", res.data.role);
          setCurrentUser(res.data.username);
          setUserRole(res.data.role);
          setIsAuthenticated(true);

          return true;
      } catch (err) {
          console.log("Login failed:", err.response?.data || err.message);
          return false;
      }
  };

  // Logout function to pass to the MainApp
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("token");// <-- Clear the username on logout
  };

  // Conditional rendering:
  // If authenticated, show MainApp.
  // Otherwise, show LoginScreen.
  return (
    <div className="App">
      {isAuthenticated ? (
        <MainApp onLogout={handleLogout} username={currentUser} role={userRole} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}


