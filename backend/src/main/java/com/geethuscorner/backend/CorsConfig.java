package com.geethuscorner.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration   // Spring reads this class when the app starts
public class CorsConfig implements WebMvcConfigurer {

    // Our frontend address. Locally 5173, later our live Vercel URL.
    @Value("${FRONTEND_URL:https://geethuscorner.vercel.app}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")                        // for all our APIs
                .allowedOrigins(frontendUrl)                  // only OUR website is allowed
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}