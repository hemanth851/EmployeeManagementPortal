package com.employee.controller;

import com.employee.model.Employee;
import com.employee.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing CRUD endpoints for Employee Management.
 * Annotated with @CrossOrigin to allow React frontend communication.
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*") // Allows communication from any frontend host (e.g., http://localhost:5173)
public class EmployeeController {

    private final EmployeeService employeeService;

    // Constructor-based Dependency Injection (Spring best practice)
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * 1. GET /api/employees
     * Retrieves the complete list of employees.
     */
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> list = employeeService.getAllEmployees();
        return ResponseEntity.ok(list);
    }

    /**
     * 2. GET /api/employees/{id}
     * Retrieves an employee by their ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    /**
     * 3. POST /api/employees
     * Adds a new employee record. Returns HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee) {
        Employee createdEmployee = employeeService.addEmployee(employee);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    /**
     * 4. PUT /api/employees/{id}
     * Updates an existing employee record. Returns HTTP 200 (OK).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee updatedEmployee) {
        Employee employee = employeeService.updateEmployee(id, updatedEmployee);
        return ResponseEntity.ok(employee);
    }

    /**
     * 5. DELETE /api/employees/{id}
     * Deletes an employee record by ID. Returns HTTP 200 (OK) with a confirmation message.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Employee with ID " + id + " was deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
