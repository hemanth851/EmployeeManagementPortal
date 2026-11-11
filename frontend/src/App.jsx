import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeList from './components/EmployeeList.jsx';
import SearchEmployee from './components/SearchEmployee.jsx';

const API_BASE_URL = 'http://localhost:8080/api/employees';

function App() {
  // Application State
  const [employees, setEmployees] = useState([]);
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Auto-dismiss notification after 4 seconds
  const showNotification = (message, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 4500);
  };

  // 1. Fetch all employees (Read)
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch employees (Status: ${response.status})`);
      }
      const data = await response.json();
      setEmployees(data);
      setDisplayedEmployees(data);
      setIsSearching(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      showNotification('Unable to connect to backend server. Make sure Spring Boot is running on port 8080.', true);
    } finally {
      setLoading(false);
    }
  };

  // Load employees on initial component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Add or Update Employee (Create / Update)
  const handleSaveEmployee = async (employeeData, isUpdate) => {
    try {
      let response;
      if (isUpdate) {
        // PUT /api/employees/{id}
        response = await fetch(`${API_BASE_URL}/${employeeData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData)
        });
      } else {
        // POST /api/employees
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData)
        });
      }

      const result = await response.json();

      if (!response.ok) {
        // Extract server-side validation or error message
        const message = result.message || 'Operation failed. Please check inputs.';
        showNotification(message, true);
        return;
      }

      showNotification(
        isUpdate
          ? `Employee #${result.id} (${result.name}) was updated successfully!`
          : `Employee #${result.id} (${result.name}) was added successfully!`
      );

      setEditingEmployee(null);
      // Refresh list from backend to maintain single source of truth
      await fetchEmployees();
    } catch (err) {
      console.error('Save error:', err);
      showNotification('Network error occurred while saving employee.', true);
    }
  };

  // 3. Delete Employee (Delete)
  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete employee.');
      }

      showNotification(`Employee with ID #${id} was deleted successfully.`);

      // If we were editing this employee, cancel edit
      if (editingEmployee && editingEmployee.id === id) {
        setEditingEmployee(null);
      }

      await fetchEmployees();
    } catch (err) {
      console.error('Delete error:', err);
      showNotification(err.message || 'Failed to delete employee.', true);
    }
  };

  // 4. Search Employee by ID
  const handleSearch = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (response.status === 404) {
        setDisplayedEmployees([]);
        setIsSearching(true);
        showNotification(`No employee found with ID #${id}.`, true);
        return;
      }
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const foundEmployee = await response.json();
      setDisplayedEmployees([foundEmployee]);
      setIsSearching(true);
      showNotification(`Found employee #${foundEmployee.id}: ${foundEmployee.name}`);
    } catch (err) {
      console.error('Search error:', err);
      showNotification('Error performing search. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and restore full list
  const handleClearSearch = () => {
    setDisplayedEmployees(employees);
    setIsSearching(false);
  };

  // Trigger edit mode for an employee
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    // Smooth scroll to form
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="container">
          {/* Notifications Banner */}
          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span className="alert-text">{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="alert-close">✕</button>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="alert-close">✕</button>
            </div>
          )}

          {/* Metric Dashboard */}
          <Dashboard employees={employees} />

          {/* Search Bar */}
          <SearchEmployee
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isSearching={isSearching}
          />

          {/* Main Grid: Form (Left) & Table (Right) */}
          <div className="content-grid">
            <div className="form-column">
              <EmployeeForm
                onSubmit={handleSaveEmployee}
                editingEmployee={editingEmployee}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            <div className="list-column">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading employee data...</p>
                </div>
              ) : (
                <EmployeeList
                  employees={displayedEmployees}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteEmployee}
                  editingEmployeeId={editingEmployee ? editingEmployee.id : null}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} Employee Management Portal • Spring Boot & React CRUD Portfolio Project</p>
          <p className="footer-credits">Crafted for Java Full-Stack Trainee Technical Interviews</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
