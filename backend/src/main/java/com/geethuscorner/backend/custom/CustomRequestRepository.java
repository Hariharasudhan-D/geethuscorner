package com.geethuscorner.backend.custom;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomRequestRepository extends JpaRepository<CustomRequest, Long> {

    // My requests, newest first (user loaded in the same query)
    @EntityGraph(attributePaths = "user")
    List<CustomRequest> findByUserEmailOrderByCreatedAtDesc(String email);

    // ADMIN: all requests, newest first
    @EntityGraph(attributePaths = "user")
    List<CustomRequest> findAllByOrderByCreatedAtDesc();
}
