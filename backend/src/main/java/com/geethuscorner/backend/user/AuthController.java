package com.geethuscorner.backend.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")   // all login/signup URLs start with /api/auth
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/signup → create a customer account
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)   // 201
    public Map<String, String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return Map.of("message", "Account created successfully");
    }
}