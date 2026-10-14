package com.geethuscorner.backend.review;

import com.geethuscorner.backend.NotFoundException;
import com.geethuscorner.backend.cake.Cake;
import com.geethuscorner.backend.cake.CakeRepository;
import com.geethuscorner.backend.order.OrderRepository;
import com.geethuscorner.backend.order.OrderStatus;
import com.geethuscorner.backend.user.User;
import com.geethuscorner.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final CakeRepository cakeRepository;
    private final UserRepository userRepository;

    // CUSTOMER: add a review
    @Transactional
    public ReviewResponse addReview(String email, ReviewRequest request) {

        // 1. Only people who RECEIVED this cake can review it
        boolean receivedIt = orderRepository.existsByUserEmailAndStatusAndItemsCakeId(
                email, OrderStatus.DELIVERED, request.cakeId());
        if (!receivedIt) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can review a cake after it is delivered to you");
        }

        // 2. Only one review per cake
        if (reviewRepository.existsByUserEmailAndCakeId(email, request.cakeId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this cake");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        Cake cake = cakeRepository.findById(request.cakeId())
                .orElseThrow(() -> new NotFoundException("Cake not found"));

        Review review = new Review();
        review.setUser(user);
        review.setCakeId(cake.getId());
        review.setCakeName(cake.getName());
        review.setRating(request.rating());
        review.setComment(request.comment() == null ? null : request.comment().trim());

        return ReviewResponse.from(reviewRepository.save(review));
    }

    // CUSTOMER: which cakes have I already reviewed?
    @Transactional(readOnly = true)
    public List<Long> getMyReviewedCakeIds(String email) {
        return reviewRepository.findByUserEmail(email).stream()
                .map(Review::getCakeId)
                .toList();
    }

    // PUBLIC: newest reviews for the home page
    @Transactional(readOnly = true)
    public List<ReviewResponse> getLatest() {
        return reviewRepository.findTop6ByOrderByCreatedAtDesc().stream()
                .map(ReviewResponse::from)
                .toList();
    }

    // PUBLIC: average stars for every cake
    @Transactional(readOnly = true)
    public List<RatingSummary> getSummaries() {
        Map<Long, Integer> starTotals = new HashMap<>();   // cakeId → all stars added up
        Map<Long, Integer> counts = new HashMap<>();       // cakeId → number of reviews

        for (Review review : reviewRepository.findAll()) {
            Long cakeId = review.getCakeId();
            starTotals.put(cakeId, starTotals.getOrDefault(cakeId, 0) + review.getRating());
            counts.put(cakeId, counts.getOrDefault(cakeId, 0) + 1);
        }

        List<RatingSummary> result = new ArrayList<>();
        for (Long cakeId : counts.keySet()) {
            double average = (double) starTotals.get(cakeId) / counts.get(cakeId);
            double rounded = Math.round(average * 10) / 10.0;   // 4.666 → 4.7
            result.add(new RatingSummary(cakeId, rounded, counts.get(cakeId)));
        }
        return result;
    }

    // ADMIN: delete a review
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found"));
        reviewRepository.delete(review);
    }
}
