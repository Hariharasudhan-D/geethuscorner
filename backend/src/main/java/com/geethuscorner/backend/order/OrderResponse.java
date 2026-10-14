package com.geethuscorner.backend.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// What we send back. No user object, so no password hash ever leaves the server.
public record OrderResponse(
        Long id,
        OrderStatus status,
        String customerName,      // for the admin
        String phone,
        DeliveryType deliveryType,
        String address,
        LocalDate deliveryDate,
        TimeSlot timeSlot,
        PaymentMethod paymentMethod,
        String note,
        BigDecimal total,
        LocalDateTime createdAt,
        List<Item> items
) {

    public record Item(Long cakeId, String cakeName, BigDecimal price, int quantity) {
    }

    // Turn an Order entity into a SAFE response (no user object, no password hash)
    public static OrderResponse from(Order order) {
        List<Item> items = order.getItems().stream()
                .map(i -> new Item(i.getCakeId(), i.getCakeName(), i.getPrice(), i.getQuantity()))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getUser().getName(),   // only the name, never the whole user
                order.getPhone(),
                order.getDeliveryType(),
                order.getAddress(),
                order.getDeliveryDate(),
                order.getTimeSlot(),
                order.getPaymentMethod(),
                order.getNote(),
                order.getTotal(),
                order.getCreatedAt(),
                items
        );
    }
}
