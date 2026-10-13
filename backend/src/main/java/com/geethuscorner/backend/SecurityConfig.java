package com.geethuscorner.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration   // Spring reads this class when the app starts
public class SecurityConfig {

    // The fingerprint machine 🔒 (we use it in signup and login)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // The guard's rules. For NOW: let everyone in. We lock doors in Step 5.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())                           // not needed for JWT (see below)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());  // all doors open (temporary)
        return http.build();
    }
}