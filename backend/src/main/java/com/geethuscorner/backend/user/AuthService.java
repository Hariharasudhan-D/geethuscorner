package com.geethuscorner.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;   // the BCrypt machine from SecurityConfig 🔒

    public void signup(SignupRequest request) {

        // 1. Clean the email: " Hari@Gmail.com " → "hari@gmail.com"
        String email = request.email().trim().toLowerCase();

        // 2. Is this email already a member?
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered");
        }

        // 3. Fill in the new member
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));   // save the FINGERPRINT, never the real password
        user.setPhone(request.phone());
        // role = CUSTOMER automatically (default in User.java)

        // 4. Write it in the members book
        userRepository.save(user);
    }
}