package com.employee;

import com.employee.exception.DuplicateResourceException;
import com.employee.exception.ResourceNotFoundException;
import com.employee.exception.ValidationException;
import com.employee.model.Employee;
import com.employee.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying all CRUD operations and validations in EmployeeService.
 */
public class EmployeeServiceTest {

    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService();
    }

    @Test
    @DisplayName("Should retrieve initial seeded employees")
    void testGetAllEmployees() {
        List<Employee> list = employeeService.getAllEmployees();
        assertNotNull(list);
        assertEquals(4, list.size());
    }

    @Test
    @DisplayName("Should find employee by existing ID")
    void testGetEmployeeByIdSuccess() {
        Employee employee = employeeService.getEmployeeById(101L);
        assertNotNull(employee);
        assertEquals("Rahul Sharma", employee.getName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when ID does not exist")
    void testGetEmployeeByIdNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.getEmployeeById(999L);
        });
    }

    @Test
    @DisplayName("Should add new employee successfully")
    void testAddEmployeeSuccess() {
        Employee newEmp = new Employee(105L, "Karan Singh", "karan.singh@example.com", "Finance", 70000.0);
        Employee created = employeeService.addEmployee(newEmp);

        assertNotNull(created);
        assertEquals(105L, created.getId());
        assertEquals(5, employeeService.getAllEmployees().size());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException on duplicate ID")
    void testAddEmployeeDuplicateId() {
        Employee duplicateEmp = new Employee(101L, "Rahul Dup", "rahul.dup@example.com", "IT", 60000.0);
        assertThrows(DuplicateResourceException.class, () -> {
            employeeService.addEmployee(duplicateEmp);
        });
    }

    @Test
    @DisplayName("Should throw ValidationException on invalid email")
    void testAddEmployeeInvalidEmail() {
        Employee badEmailEmp = new Employee(106L, "Test Name", "bad-email", "IT", 60000.0);
        assertThrows(ValidationException.class, () -> {
            employeeService.addEmployee(badEmailEmp);
        });
    }

    @Test
    @DisplayName("Should throw ValidationException on negative or zero salary")
    void testAddEmployeeInvalidSalary() {
        Employee badSalaryEmp = new Employee(107L, "Test Name", "valid@example.com", "IT", -500.0);
        assertThrows(ValidationException.class, () -> {
            employeeService.addEmployee(badSalaryEmp);
        });
    }

    @Test
    @DisplayName("Should update existing employee successfully")
    void testUpdateEmployeeSuccess() {
        Employee updateData = new Employee(101L, "Rahul S. Updated", "rahul.updated@example.com", "Leadership", 95000.0);
        Employee updated = employeeService.updateEmployee(101L, updateData);

        assertEquals("Rahul S. Updated", updated.getName());
        assertEquals("rahul.updated@example.com", updated.getEmail());
        assertEquals("Leadership", updated.getDepartment());
        assertEquals(95000.0, updated.getSalary());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent ID")
    void testUpdateEmployeeNotFound() {
        Employee updateData = new Employee(999L, "Ghost", "ghost@example.com", "HR", 50000.0);
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.updateEmployee(999L, updateData);
        });
    }

    @Test
    @DisplayName("Should delete employee successfully")
    void testDeleteEmployeeSuccess() {
        employeeService.deleteEmployee(102L);
        assertEquals(3, employeeService.getAllEmployees().size());
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.getEmployeeById(102L);
        });
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent ID")
    void testDeleteEmployeeNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.deleteEmployee(999L);
        });
    }
}
