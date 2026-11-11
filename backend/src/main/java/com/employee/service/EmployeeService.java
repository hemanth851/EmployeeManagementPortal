package com.employee.service;

import com.employee.exception.DuplicateResourceException;
import com.employee.exception.ResourceNotFoundException;
import com.employee.exception.ValidationException;
import com.employee.model.Employee;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Service class that contains the business logic for managing employees.
 * Uses an in-memory ArrayList<Employee> for data storage.
 */
@Service
public class EmployeeService {

    // In-memory list to store employee records
    private final List<Employee> employeeList = new ArrayList<>();

    // Simple regex pattern for validating email addresses
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    /**
     * Constructor initializes with realistic sample data
     * so that the application has records on first launch.
     */
    public EmployeeService() {
        seedSampleData();
    }

    private void seedSampleData() {
        employeeList.add(new Employee(101L, "Rahul Sharma", "rahul.sharma@example.com", "Engineering", 75000.0));
        employeeList.add(new Employee(102L, "Priya Patel", "priya.patel@example.com", "Human Resources", 62000.0));
        employeeList.add(new Employee(103L, "Amit Verma", "amit.verma@example.com", "Marketing", 58000.0));
        employeeList.add(new Employee(104L, "Sneha Kulkarni", "sneha.k@example.com", "Engineering", 82000.0));
    }

    /**
     * Retrieves all employees.
     * Returns an unmodifiable copy to protect internal list encapsulation.
     */
    public List<Employee> getAllEmployees() {
        return Collections.unmodifiableList(new ArrayList<>(employeeList));
    }

    /**
     * Searches for an employee by their unique ID.
     * Throws ResourceNotFoundException if no matching employee exists.
     */
    public Employee getEmployeeById(Long id) {
        if (id == null) {
            throw new ValidationException("Employee ID cannot be null.");
        }

        return employeeList.stream()
                .filter(emp -> emp.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Employee with ID " + id + " not found."));
    }

    /**
     * Adds a new employee after validating inputs and checking for duplicate ID.
     */
    public Employee addEmployee(Employee employee) {
        validateEmployee(employee, false);

        // Check if ID already exists
        boolean exists = employeeList.stream()
                .anyMatch(emp -> emp.getId().equals(employee.getId()));

        if (exists) {
            throw new DuplicateResourceException("An employee with ID " + employee.getId() + " already exists.");
        }

        employeeList.add(employee);
        return employee;
    }

    /**
     * Updates an existing employee by ID.
     */
    public Employee updateEmployee(Long id, Employee updatedData) {
        if (id == null) {
            throw new ValidationException("Employee ID must be provided in the URL.");
        }

        validateEmployee(updatedData, true);

        // Locate the existing employee
        for (int i = 0; i < employeeList.size(); i++) {
            Employee current = employeeList.get(i);
            if (current.getId().equals(id)) {
                current.setName(updatedData.getName().trim());
                current.setEmail(updatedData.getEmail().trim());
                current.setDepartment(updatedData.getDepartment().trim());
                current.setSalary(updatedData.getSalary());
                return current;
            }
        }

        throw new ResourceNotFoundException("Cannot update. Employee with ID " + id + " not found.");
    }

    /**
     * Deletes an employee by ID.
     * Throws ResourceNotFoundException if the employee does not exist.
     */
    public void deleteEmployee(Long id) {
        if (id == null) {
            throw new ValidationException("Employee ID cannot be null.");
        }

        boolean removed = employeeList.removeIf(emp -> emp.getId().equals(id));
        if (!removed) {
            throw new ResourceNotFoundException("Cannot delete. Employee with ID " + id + " not found.");
        }
    }

    /**
     * Validates employee fields according to business requirements:
     * - All fields mandatory
     * - Valid email format
     * - Positive salary (> 0)
     */
    private void validateEmployee(Employee employee, boolean isUpdate) {
        if (employee == null) {
            throw new ValidationException("Employee payload cannot be null or empty.");
        }

        if (!isUpdate) {
            if (employee.getId() == null) {
                throw new ValidationException("Employee ID is mandatory.");
            }
            if (employee.getId() <= 0) {
                throw new ValidationException("Employee ID must be a positive integer.");
            }
        }

        if (employee.getName() == null || employee.getName().trim().isEmpty()) {
            throw new ValidationException("Employee Name is mandatory.");
        }

        if (employee.getEmail() == null || employee.getEmail().trim().isEmpty()) {
            throw new ValidationException("Email address is mandatory.");
        }

        if (!EMAIL_PATTERN.matcher(employee.getEmail().trim()).matches()) {
            throw new ValidationException("Invalid email format. Expected format: user@domain.com");
        }

        if (employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()) {
            throw new ValidationException("Department is mandatory.");
        }

        if (employee.getSalary() == null) {
            throw new ValidationException("Salary is mandatory.");
        }

        if (employee.getSalary() <= 0) {
            throw new ValidationException("Salary must be a positive value greater than 0.");
        }
    }
}
