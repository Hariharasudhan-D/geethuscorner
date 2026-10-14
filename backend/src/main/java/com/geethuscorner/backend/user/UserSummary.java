package com.geethuscorner.backend.user;

import java.time.LocalDateTime;

// Safe customer info for the admin (NO password)
public record UserSummary(
        Long id,
        String name,
        String email,
        String phone,
        Role role,
        LocalDateTime createdAt,
        long orderCount
) {
}
