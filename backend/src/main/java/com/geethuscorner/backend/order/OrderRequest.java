package com.geethuscorner.backend.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

// The order form. Note: there is NO price and NO total here, on purpose.
public record OrderRequest(

        @NotEmpty(message = "Your cart is empty")
        @Size(max = 20, message = "Too many items in one order")
        @Valid                                    // also check each item's rules
        List<Item> items,

        @NotNull(message = "Choose delivery or pickup")
        DeliveryType deliveryType,

        @Size(max = 500, message = "Address is too long")
        String address,

        @NotNull(message = "Choose a date")
        @Future(message = "Please choose a date from tomorrow onwards")
        LocalDate deliveryDate,

        @NotNull(message = "Choose a payment method")
        PaymentMethod paymentMethod,

        @Size(max = 500, message = "Note is too long")
        String note
) {

    // One cart line: only WHICH cake and HOW MANY
    public record Item(
            @NotNull(message = "Cake is required")
            Long cakeId,

            @NotNull(message = "Quantity is required")
            @Min(value = 1, message = "Quantity must be at least 1")
            @Max(value = 10, message = "Maximum 10 of one cake")
            Integer quantity
    ) {
    }
}
