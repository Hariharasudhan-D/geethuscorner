package com.geethuscorner.backend.review;

// Stars for one cake, e.g. cake 3: 4.5 average from 2 reviews
public record RatingSummary(Long cakeId, double average, int count) {
}
