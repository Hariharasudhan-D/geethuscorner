package com.geethuscorner.backend;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice   // the help desk for ALL controllers 🙋‍♀️
public class GlobalExceptionHandler {

    // Helper: build { "status": 404, "message": "..." }
    private ResponseEntity<Map<String, Object>> answer(HttpStatusCode status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    // Thing not found → 404
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
        return answer(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Form rules failed (@Valid) → 400 with each wrong field
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());   // "price" → "Price must be more than 0"
        }
        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("message", "Please check your input");
        body.put("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    // Our own business rules (sold out, fully booked, wrong password...)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
        return answer(ex.getStatusCode(), ex.getReason());
    }

    // Broken JSON, or a wrong value like "deliveryType": "TRAIN" → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleBadJson(HttpMessageNotReadableException ex) {
        return answer(HttpStatus.BAD_REQUEST, "Invalid request. Please check the data you sent.");
    }

    // /api/cakes/abc instead of a number → 400
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return answer(HttpStatus.BAD_REQUEST, "Invalid value: " + ex.getValue());
    }

    // Photo bigger than 5 MB → 400
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleTooBig(MaxUploadSizeExceededException ex) {
        return answer(HttpStatus.BAD_REQUEST, "Photo is too large. Maximum size is 5 MB.");
    }

    // A database "unique" rule was broken (e.g. two reviews at the same moment) → 409
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(DataIntegrityViolationException ex) {
        return answer(HttpStatus.CONFLICT, "This already exists.");
    }

    // Anything else
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleOther(Exception ex) {
        // Spring's own errors (unknown URL → 404, wrong method → 405) already know their status
        if (ex instanceof ErrorResponse errorResponse) {
            HttpStatusCode status = errorResponse.getStatusCode();
            return answer(status, HttpStatus.valueOf(status.value()).getReasonPhrase());
        }
        // A real bug: full details go to the Render logs, never to the customer
        log.error("Unexpected error", ex);
        return answer(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
    }
}
