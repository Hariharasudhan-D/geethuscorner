package com.geethuscorner.backend.custom;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

// What the admin sends
public record CustomReplyForm(

        @NotNull(message = "Status is required")
        CustomRequestStatus status,

        @Positive(message = "Price must be more than 0")
        BigDecimal quotedPrice,

        @Size(max = 500, message = "Reply is too long")
        String adminReply
) {
}
