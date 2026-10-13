package com.geethuscorner.backend;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice    // help desk for ALL controllers
public class GlobalExceptionHandler {

    // Problem 1: not found → 404
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
        Map<String, Object> body = Map.of(
                "status", 404,
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Problem 2: form rules failed (@Valid) → 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());   // "price" → "Price must be more than 0"
        }

        Map<String, Object> body = Map.of(
                "status", 400,
                "message", "Please check your input",
                "errors", errors
        );
        return ResponseEntity.badRequest().body(body);
    }
    // ---------- Problem 3: a business rule we broke on purpose (e.g. email already used) ----------
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", ex.getStatusCode().value());   // e.g. 409
        body.put("message", ex.getReason());              // e.g. "This email is already registered"
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }
}