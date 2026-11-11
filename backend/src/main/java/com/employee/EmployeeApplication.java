package com.employee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Employee Management Portal Spring Boot backend application.
 */
@SpringBootApplication
public class EmployeeApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Employee Management Portal Backend Started!     ");
        System.out.println(" Access REST API at: http://localhost:8080/api/employees ");
        System.out.println("=================================================");
    }
}
