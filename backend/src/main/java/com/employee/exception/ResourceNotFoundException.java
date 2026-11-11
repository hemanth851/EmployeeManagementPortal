package com.employee.exception;

/**
 * Exception thrown when a requested resource (like an Employee ID) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
