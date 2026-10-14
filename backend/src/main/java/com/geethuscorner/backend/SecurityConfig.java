package com.geethuscorner.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;   // the guard needs this to read wristbands

    // The fingerprint machine 🔒 (signup, login, change password)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // The RULE BOOK 📋 (read top to bottom, the FIRST matching rule wins)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())                  // we use JWT, not cookies
                .cors(Customizer.withDefaults())               // use the CORS rules below
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e.authenticationEntryPoint(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))   // not logged in → 401

                .authorizeHttpRequests(auth -> auth
                        // 🟢 Open to everyone
                        .requestMatchers("/api/health", "/api/auth/signup", "/api/auth/login", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/booking-info",       // closed and full dates (checkout)
                                "/api/reviews/latest",     // reviews on the home page
                                "/api/reviews/summary"     // star ratings on cake cards
                        ).permitAll()

                        // 🔴 Admin only
                        .requestMatchers(HttpMethod.GET, "/api/cakes/all").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🟢 Everyone can see the menu and one cake
                        .requestMatchers(HttpMethod.GET, "/api/cakes", "/api/cakes/*").permitAll()

                        // 🔴 Admin only: add, edit, delete cakes (POST, PUT, DELETE)
                        .requestMatchers("/api/cakes/**").hasRole("ADMIN")

                        // 🟡 Everything else: must be logged in
                        .anyRequest().authenticated()
                )

                // Our guard reads the wristband BEFORE Spring's own login filter
                .addFilterBefore(new JwtFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS: which websites may call our API.
    // Default = the live site AND your laptop. On Render you can override it with FRONTEND_URL
    // (one link, or several links separated by commas, with no "/" at the end).
    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${FRONTEND_URL:https://geethuscorner.vercel.app,http://localhost:5173}")
            String frontendUrls) {

        List<String> allowedSites = Arrays.stream(frontendUrls.split(","))   // "a,b" → ["a", "b"]
                .map(String::trim)                                           // remove spaces
                .toList();

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedSites);                                // only OUR websites
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));   // allow the wristband header

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
