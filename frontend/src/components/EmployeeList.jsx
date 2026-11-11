import React from 'react';

/**
 * EmployeeList Component
 * Displays employees in a clean, modern responsive table.
 * Includes Edit and Delete action triggers, with confirmation dialog on delete.
 */
function EmployeeList({ employees, onEdit, onDelete, editingEmployeeId }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="table-card">
        <div className="card-header">
          <h3 className="card-title">📋 Employee Directory</h3>
          <p className="card-subtitle">All registered personnel in the organization</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h4 className="empty-title">No Employees Found</h4>
          <p className="empty-description">
            There are currently no employee records matching your query. Add a new employee using the form above.
          </p>
        </div>
      </div>
    );
  }

  const handleDeleteClick = (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete employee "${employee.name}" (ID: #${employee.id})?\n\nThis action cannot be undone.`
    );
    if (confirmed) {
      onDelete(employee.id);
    }
  };

  return (
    <div className="table-card">
      <div className="card-header">
        <div className="header-flex">
          <div>
            <h3 className="card-title">📋 Employee Directory</h3>
            <p className="card-subtitle">
              Showing {employees.length} {employees.length === 1 ? 'employee record' : 'employee records'}
            </p>
          </div>
          <span className="badge badge-count">{employees.length} Records</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const isBeingEdited = editingEmployeeId === emp.id;
              return (
                <tr key={emp.id} className={isBeingEdited ? 'row-editing' : ''}>
                  <td className="cell-id">#{emp.id}</td>
                  <td className="cell-name">
                    <span className="avatar-circle">
                      {emp.name ? emp.name.charAt(0).toUpperCase() : '?'}
                    </span>
                    <span className="name-text">{emp.name}</span>
                  </td>
                  <td className="cell-email">{emp.email}</td>
                  <td>
                    <span className={`department-pill dept-${(emp.department || 'other').toLowerCase().replace(/\s+/g, '-')}`}>
                      {emp.department}
                    </span>
                  </td>
                  <td className="cell-salary">
                    ₹{Number(emp.salary).toLocaleString('en-IN')}
                  </td>
                  <td className="text-center cell-actions">
                    <button
                      type="button"
                      onClick={() => onEdit(emp)}
                      className="btn-action btn-edit"
                      title="Edit this employee"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(emp)}
                      className="btn-action btn-delete"
                      title="Delete this employee"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
