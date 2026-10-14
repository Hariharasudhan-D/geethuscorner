package com.geethuscorner.backend.order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // My orders, newest first.
    // @EntityGraph loads each order's items in the SAME query (one trip to the database, not many)
    @EntityGraph(attributePaths = "items")
    List<Order> findByUserEmailOrderByCreatedAtDesc(String email);
}
