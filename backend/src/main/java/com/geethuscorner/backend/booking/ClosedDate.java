package com.geethuscorner.backend.booking;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

// A day the shop is closed (holiday, family function...)
@Entity
@Table(name = "closed_dates")
@Getter
@Setter
@NoArgsConstructor
public class ClosedDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)   // each date only once
    private LocalDate closedOn;

    @Column(length = 100)
    private String reason;
}
