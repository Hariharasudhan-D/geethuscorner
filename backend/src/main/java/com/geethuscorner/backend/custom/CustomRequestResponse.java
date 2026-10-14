package com.geethuscorner.backend.custom;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CustomRequestResponse(
        Long id,
        String customerName,
        String phone,
        String occasion,
        String flavour,
        String weight,
        LocalDate neededDate,
        String description,
        Integer budget,
        CustomRequestStatus status,
        BigDecimal quotedPrice,
        String adminReply,
        LocalDateTime createdAt
) {

    // Safe response: name and phone only, never the whole user
    public static CustomRequestResponse from(CustomRequest r) {
        return new CustomRequestResponse(
                r.getId(),
                r.getUser().getName(),
                r.getUser().getPhone(),
                r.getOccasion(),
                r.getFlavour(),
                r.getWeight(),
                r.getNeededDate(),
                r.getDescription(),
                r.getBudget(),
                r.getStatus(),
                r.getQuotedPrice(),
                r.getAdminReply(),
                r.getCreatedAt()
        );
    }
}
