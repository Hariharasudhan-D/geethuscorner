package com.geethuscorner.backend.order;

import jakarta.validation.constraints.NotNull;

// The admin's "move the sticker" form
public record UpdateStatusRequest(

        @NotNull(message = "Status is required")
        OrderStatus status
) {
}
