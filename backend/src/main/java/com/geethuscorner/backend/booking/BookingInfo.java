package com.geethuscorner.backend.booking;

import java.time.LocalDate;
import java.util.List;

// What the checkout page needs to know
public record BookingInfo(
        int maxDaysAhead,
        List<LocalDate> closedDates,
        List<LocalDate> fullDates
) {
}
