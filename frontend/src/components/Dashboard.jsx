import React from 'react';

/**
 * Dashboard Component
 * Displays summary cards for total employees, unique department count, and payroll overview.
 */
function Dashboard({ employees }) {
  const totalEmployees = employees.length;

  // Calculate unique departments
  const uniqueDepartments = Array.from(
    new Set(employees.map(emp => emp.department).filter(Boolean))
  );
  const departmentCount = uniqueDepartments.length;

  // Calculate average salary
  const totalSalary = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
  const averageSalary = totalEmployees > 0 ? Math.round(totalSalary / totalEmployees) : 0;

  return (
    <section className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-icon stat-icon-blue">👥</div>
        <div className="stat-content">
          <span className="stat-label">Total Employees</span>
          <span className="stat-value">{totalEmployees}</span>
          <span className="stat-help">Active in portal</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-purple">🏢</div>
        <div className="stat-content">
          <span className="stat-label">Departments</span>
          <span className="stat-value">{departmentCount}</span>
          <span className="stat-help">
            {departmentCount > 0 ? uniqueDepartments.slice(0, 3).join(', ') + (departmentCount > 3 ? '...' : '') : 'None'}
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-green">💰</div>
        <div className="stat-content">
          <span className="stat-label">Average Salary</span>
          <span className="stat-value">₹{averageSalary.toLocaleString('en-IN')}</span>
          <span className="stat-help">Monthly per employee</span>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
