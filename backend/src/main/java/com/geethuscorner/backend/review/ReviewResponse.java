package com.geethuscorner.backend.review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        String customerName,   // first name only
        Long cakeId,
        String cakeName,
        int rating,
        String comment,
        LocalDateTime createdAt
) {

    public static ReviewResponse from(Review review) {
        String firstName = review.getUser().getName().split(" ")[0];   // "Hari Sudhan" → "Hari"
        return new ReviewResponse(
                review.getId(),
                firstName,
                review.getCakeId(),
                review.getCakeName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
