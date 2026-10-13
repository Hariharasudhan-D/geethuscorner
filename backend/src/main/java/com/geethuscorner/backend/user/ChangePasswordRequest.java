package com.geethuscorner.backend.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// The change-password form
public record ChangePasswordRequest(

        @NotBlank(message = "Old password is required")
        String oldPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 72, message = "New password must be 8 to 72 characters")
        String newPassword
) {
}