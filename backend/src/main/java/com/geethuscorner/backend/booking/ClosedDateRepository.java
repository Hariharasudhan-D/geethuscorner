package com.geethuscorner.backend.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ClosedDateRepository extends JpaRepository<ClosedDate, Long> {

    boolean existsByClosedOn(LocalDate date);

    // Upcoming closed dates, soonest first
    List<ClosedDate> findByClosedOnGreaterThanEqualOrderByClosedOnAsc(LocalDate from);
}
