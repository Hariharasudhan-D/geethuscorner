package com.geethuscorner.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email (used in login)
    Optional<User> findByEmail(String email);

    // Check if an email is already taken (used in signup)
    boolean existsByEmail(String email);
}