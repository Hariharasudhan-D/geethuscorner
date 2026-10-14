package com.geethuscorner.backend.booking;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // PUBLIC: closed and full dates for the checkout page
    @GetMapping("/api/booking-info")
    public BookingInfo getBookingInfo() {
        return bookingService.getBookingInfo();
    }

    // ADMIN: list upcoming holidays
    @GetMapping("/api/admin/closed-dates")
    public List<ClosedDate> getClosedDates() {
        return bookingService.getClosedDates();
    }

    // ADMIN: add a holiday
    @PostMapping("/api/admin/closed-dates")
    @ResponseStatus(HttpStatus.CREATED)
    public ClosedDate addClosedDate(@Valid @RequestBody ClosedDateRequest request) {
        return bookingService.addClosedDate(request);
    }

    // ADMIN: remove a holiday
    @DeleteMapping("/api/admin/closed-dates/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClosedDate(@PathVariable Long id) {
        bookingService.deleteClosedDate(id);
    }
}
