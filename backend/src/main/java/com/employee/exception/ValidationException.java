package com.employee.exception;

/**
 * Exception thrown when input validation fails (e.g., negative salary, bad email, empty fields).
 */
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
