package com.geethuscorner.backend;

// Our own error: "the thing you asked for doesn't exist"
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);   // keep the message inside the error
    }
}