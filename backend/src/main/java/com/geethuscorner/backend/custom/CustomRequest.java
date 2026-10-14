package com.geethuscorner.backend.custom;

import com.geethuscorner.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_requests")
@Getter
@Setter
@NoArgsConstructor
public class CustomRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who asked (many requests → one user)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String occasion;        // Birthday, Anniversary...

    @Column(nullable = false, length = 100)
    private String flavour;

    @Column(nullable = false, length = 20)
    private String weight;          // "1 kg"

    @Column(nullable = false)
    private LocalDate neededDate;

    @Column(nullable = false, length = 1000)
    private String description;     // the design idea

    private Integer budget;         // optional, in rupees

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomRequestStatus status = CustomRequestStatus.PENDING;

    @Column(precision = 10, scale = 2)
    private BigDecimal quotedPrice; // mother's price

    @Column(length = 500)
    private String adminReply;      // mother's message

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
