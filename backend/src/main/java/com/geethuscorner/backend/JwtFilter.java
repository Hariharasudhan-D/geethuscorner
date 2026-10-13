package com.geethuscorner.backend;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// The guard: runs ONCE for every request and reads the wristband (JWT)
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Look for the wristband: "Authorization: Bearer eyJhbGci..."
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);   // cut off "Bearer " (7 letters)

            try {
                // 2. Check the seal + expiry, and read the info inside
                Claims claims = jwtService.readToken(token);
                String email = claims.getSubject();
                String role = claims.get("role", String.class);

                // 3. Tell Spring Security: "this person is <email>, with role <role>"
                var authority = new SimpleGrantedAuthority("ROLE_" + role);   // e.g. ROLE_ADMIN
                var auth = new UsernamePasswordAuthenticationToken(email, null, List.of(authority));

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(auth);
                SecurityContextHolder.setContext(context);

            } catch (JwtException | IllegalArgumentException e) {
                // Fake, changed or expired wristband → treat as a stranger (do nothing)
            }
        }

        // 4. Let the request continue. The rule book decides if it may enter.
        filterChain.doFilter(request, response);
    }
}