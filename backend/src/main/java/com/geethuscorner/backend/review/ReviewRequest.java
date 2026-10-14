package com.geethuscorner.backend.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(

        @NotNull(message = "Cake is required")
        Long cakeId,

        @NotNull(message = "Choose a rating")
        @Min(value = 1, message = "Rating must be 1 to 5")
        @Max(value = 5, message = "Rating must be 1 to 5")
        Integer rating,

        @Size(max = 500, message = "Comment is too long")
        String comment
) {
}
