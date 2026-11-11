import React, { useState, useEffect } from 'react';

/**
 * EmployeeForm Component
 * Handles adding new employee records and updating existing ones.
 * Implements client-side validation and supports form reset.
 */
function EmployeeForm({ onSubmit, editingEmployee, onCancelEdit }) {
  const initialFormData = {
    id: '',
    name: '',
    email: '',
    department: '',
    salary: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // When editingEmployee prop changes, populate or reset form
  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        id: editingEmployee.id.toString(),
        name: editingEmployee.name,
        email: editingEmployee.email,
        department: editingEmployee.department,
        salary: editingEmployee.salary.toString()
      });
      setErrors({});
    } else {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // ID validation (only when creating a new employee)
    if (!editingEmployee) {
      if (!formData.id.trim()) {
        newErrors.id = 'Employee ID is mandatory.';
      } else if (Number(formData.id) <= 0 || !Number.isInteger(Number(formData.id))) {
        newErrors.id = 'Employee ID must be a positive whole number.';
      }
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Employee Name is mandatory.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is mandatory.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g., alex@company.com).';
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is mandatory.';
    }

    // Salary validation
    if (!formData.salary.toString().trim()) {
      newErrors.salary = 'Salary is mandatory.';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      id: Number(formData.id),
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      salary: Number(formData.salary)
    };

    onSubmit(payload, !!editingEmployee);
  };

  const isEditMode = Boolean(editingEmployee);

  return (
    <div className={`form-card ${isEditMode ? 'form-card-editing' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">
          {isEditMode ? '✏️ Update Employee Details' : '➕ Add New Employee'}
        </h3>
        <p className="card-subtitle">
          {isEditMode
            ? `Editing employee record for ID: #${editingEmployee.id}`
            : 'Fill in the information below to register a new employee.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form-body">
        <div className="form-row">
          {/* Employee ID */}
          <div className="form-group">
            <label htmlFor="id" className="form-label">
              Employee ID <span className="required-star">*</span>
            </label>
            <input
              type="number"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={isEditMode}
              placeholder="e.g. 105"
              className={`form-control ${errors.id ? 'is-invalid' : ''} ${isEditMode ? 'input-disabled' : ''}`}
            />
            {errors.id && <span className="error-text">{errors.id}</span>}
            {isEditMode && <span className="help-text">Employee ID cannot be modified once created.</span>}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ananya Sen"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
        </div>

        <div className="form-row">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ananya.sen@example.com"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label htmlFor="department" className="form-label">
              Department <span className="required-star">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-control ${errors.department ? 'is-invalid' : ''}`}
            >
              <option value="">-- Select Department --</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Product">Product</option>
            </select>
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>
        </div>

        {/* Salary */}
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="salary" className="form-label">
              Salary (₹ Monthly) <span className="required-star">*</span>
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 65000"
              step="500"
              min="1"
              className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
            />
            {errors.salary && <span className="error-text">{errors.salary}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditMode ? '💾 Update Employee' : '➕ Add Employee'}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn btn-secondary"
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
