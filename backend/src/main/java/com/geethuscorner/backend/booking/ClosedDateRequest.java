package com.geethuscorner.backend.booking;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ClosedDateRequest(

        @NotNull(message = "Choose a date")
        @FutureOrPresent(message = "The date can't be in the past")
        LocalDate closedOn,

        @Size(max = 100, message = "Reason is too long")
        String reason
) {
}
