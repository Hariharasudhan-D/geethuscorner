package com.geethuscorner.backend.custom;

public enum CustomRequestStatus {
    PENDING,    // waiting for mother's reply
    ACCEPTED,   // she can make it (with a price)
    REJECTED    // not possible
}
