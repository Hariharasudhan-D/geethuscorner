package com.geethuscorner.backend.order;

// The journey of an order (your mother changes it in Stage 11)
public enum OrderStatus {
    PENDING,     // just placed
    CONFIRMED,   // mother accepted it
    BAKING,
    READY,
    DELIVERED,
    CANCELLED
}
