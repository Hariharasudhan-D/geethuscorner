package com.geethuscorner.backend.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")   // "user" is a reserved word in PostgreSQL, so we use "users"
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)   // no two users with the same email
    private String email;

    @Column(nullable = false)
    private String password;   // NOT the real password, only the hashed fingerprint 🔒

    @Column(length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)   // save as text "ADMIN", not as a number
    @Column(nullable = false, length = 20)
    private Role role = Role.CUSTOMER;   // new users are customers by default

    @Column(nullable = false)
    private boolean emailVerified = false;   // for email OTP in Stage 7

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}