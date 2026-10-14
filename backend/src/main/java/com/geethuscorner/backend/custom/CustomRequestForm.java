package com.geethuscorner.backend.custom;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

// What the customer sends
public record CustomRequestForm(

        @NotBlank(message = "Occasion is required")
        @Size(max = 100, message = "Occasion is too long")
        String occasion,

        @NotBlank(message = "Flavour is required")
        @Size(max = 100, message = "Flavour is too long")
        String flavour,

        @NotBlank(message = "Size is required")
        @Size(max = 20, message = "Size is too long")
        String weight,

        @NotNull(message = "Choose a date")
        LocalDate neededDate,

        @NotBlank(message = "Please describe your cake")
        @Size(max = 1000, message = "Description is too long")
        String description,

        @Positive(message = "Budget must be more than 0")
        Integer budget
) {
}
