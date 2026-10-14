package com.geethuscorner.backend.review;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByUserEmailAndCakeId(String email, Long cakeId);

    List<Review> findByUserEmail(String email);

    // The 6 newest reviews, with the user loaded too
    @EntityGraph(attributePaths = "user")
    List<Review> findTop6ByOrderByCreatedAtDesc();
}
