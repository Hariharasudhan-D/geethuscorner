package com.geethuscorner.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// The login form
public record LoginRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}