package com.geethuscorner.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.geethuscorner.backend.JwtService;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;// the BCrypt machine from SecurityConfig 🔒


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
    // LOGIN: check email + password, then give a wristband
    public Map<String, String> login(LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        // 1. Find the member
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));

        // 2. Check the password: make a new fingerprint and compare 🔍
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong email or password");
        }

        // 3. Make the wristband 🎟️
        String token = jwtService.createToken(user.getEmail(), user.getRole().name());

        // 4. Send back the wristband + basic info for the frontend
        return Map.of(
                "token", token,
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }
    // WHO AM I: return the logged-in user's basic info
    public Map<String, String> me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }

    // CHANGE PASSWORD: check the old one, then save the new fingerprint
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // 1. Is the old password correct? 🔍
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is wrong");
        }

        // 2. Save the NEW fingerprint 🔒
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}