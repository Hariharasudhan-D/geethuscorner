package com.geethuscorner.backend;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;          // the shop's secret stamp 🔏
    private final long expirationMillis;  // how long a wristband works

    // Spring fills these 2 values from application.properties
    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-hours}") long expirationHours) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationHours * 60 * 60 * 1000;   // hours → milliseconds
    }

    // MAKE a wristband for a user
    public String createToken(String email, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(email)                                          // who
                .claim("role", role)                                     // CUSTOMER or ADMIN
                .issuedAt(now)                                           // made at
                .expiration(new Date(now.getTime() + expirationMillis)) // expires at
                .signWith(key)                                           // add the seal 🔏
                .compact();                                              // turn it into text
    }

    // READ a wristband (used by the guard in Step 5)
    // If the seal is fake or the time is over, this throws an error automatically
    public Claims readToken(String token) {
        return Jwts.parser()
                .verifyWith(key)            // check the seal with our secret
                .build()
                .parseSignedClaims(token)
                .getPayload();              // the info inside: email, role, expiry
    }
}