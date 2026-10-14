package com.geethuscorner.backend.order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // My orders, newest first
    @EntityGraph(attributePaths = {"items", "user"})
    List<Order> findByUserEmailOrderByCreatedAtDesc(String email);

    // ADMIN: all orders, newest first
    @EntityGraph(attributePaths = {"items", "user"})
    List<Order> findAllByOrderByCreatedAtDesc();

    // ADMIN: how many orders a customer placed
    long countByUserId(Long userId);

    // Booking: orders on one date (not counting cancelled ones)
    long countByDeliveryDateAndStatusNot(LocalDate deliveryDate, OrderStatus status);

    // Booking: all upcoming orders (not counting cancelled ones)
    List<Order> findByDeliveryDateGreaterThanEqualAndStatusNot(LocalDate from, OrderStatus status);

    // Reviews (Part E): did this customer RECEIVE this cake?
    boolean existsByUserEmailAndStatusAndItemsCakeId(String email, OrderStatus status, Long cakeId);
}
