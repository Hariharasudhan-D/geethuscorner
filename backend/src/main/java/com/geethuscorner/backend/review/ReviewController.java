package com.geethuscorner.backend.review;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ---------- CUSTOMER (logged in) ----------

    @PostMapping("/api/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse addReview(Authentication authentication, @Valid @RequestBody ReviewRequest request) {
        return reviewService.addReview(authentication.getName(), request);
    }

    @GetMapping("/api/reviews/mine")
    public List<Long> getMyReviewedCakeIds(Authentication authentication) {
        return reviewService.getMyReviewedCakeIds(authentication.getName());
    }

    // ---------- PUBLIC (opened in Part 0) ----------

    @GetMapping("/api/reviews/latest")
    public List<ReviewResponse> getLatest() {
        return reviewService.getLatest();
    }

    @GetMapping("/api/reviews/summary")
    public List<RatingSummary> getSummaries() {
        return reviewService.getSummaries();
    }

    // ---------- ADMIN ----------

    @DeleteMapping("/api/admin/reviews/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
}
