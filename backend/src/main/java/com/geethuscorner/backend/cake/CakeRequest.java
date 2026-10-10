package com.geethuscorner.backend.cake;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

// DTO: only the fields a user is allowed to send
public record CakeRequest(

        @NotBlank(message = "Name is required")                    // not empty
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @Size(max = 1000, message = "Description is too long")
        String description,

        @NotBlank(message = "Category is required")
        String category,

        @NotNull(message = "Price is required")                    // must be sent
        @Positive(message = "Price must be more than 0")           // no 0 or minus
        BigDecimal price,

        String imageUrl,

        Boolean available                                          // optional, default true
) {
}