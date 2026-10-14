package com.geethuscorner.backend.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// What the customer sees. No user object, so no password hash ever leaves the server.
public record OrderResponse(
        Long id,
        OrderStatus status,
        DeliveryType deliveryType,
        String address,
        LocalDate deliveryDate,
        PaymentMethod paymentMethod,
        String note,
        BigDecimal total,
        LocalDateTime createdAt,
        List<Item> items
) {

    public record Item(String cakeName, BigDecimal price, int quantity) {
    }

    // Turn an Order entity into this safe response
    public static OrderResponse from(Order order) {
        List<Item> items = order.getItems().stream()
                .map(i -> new Item(i.getCakeName(), i.getPrice(), i.getQuantity()))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getDeliveryType(),
                order.getAddress(),
                order.getDeliveryDate(),
                order.getPaymentMethod(),
                order.getNote(),
                order.getTotal(),
                order.getCreatedAt(),
                items
        );
    }
}
