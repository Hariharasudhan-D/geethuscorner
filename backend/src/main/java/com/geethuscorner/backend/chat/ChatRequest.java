package com.geethuscorner.backend.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// The customer's question
public record ChatRequest(

        @NotBlank(message = "Please type a question")
        @Size(max = 500, message = "Please keep your question under 500 characters")
        String message
) {
}
