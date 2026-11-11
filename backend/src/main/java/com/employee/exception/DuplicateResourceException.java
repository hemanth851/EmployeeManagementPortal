package com.employee.exception;

/**
 * Exception thrown when trying to add an employee with an ID that already exists.
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
