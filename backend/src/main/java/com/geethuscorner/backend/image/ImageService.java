package com.geethuscorner.backend.image;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ImageService {

    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");

    private final RestClient restClient = RestClient.create();   // Spring's tool to call other websites
    private final String supabaseUrl;
    private final String secretKey;
    private final String bucket;

    public ImageService(@Value("${supabase.url}") String supabaseUrl,
                        @Value("${supabase.secret-key}") String secretKey,
                        @Value("${supabase.bucket}") String bucket) {
        this.supabaseUrl = supabaseUrl;
        this.secretKey = secretKey;
        this.bucket = bucket;
    }

    // Upload one photo and return its public link
    public String upload(MultipartFile file) throws IOException {

        if (supabaseUrl.isBlank() || secretKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Photo upload is not set up yet");
        }

        // 1. Only photos
        String type = file.getContentType();
        if (type == null || !ALLOWED_TYPES.contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only JPG, PNG or WEBP photos are allowed");
        }

        // 2. A random file name (never trust the user's own file name)
        String extension = type.substring("image/".length());   // "jpeg", "png" or "webp"
        String fileName = UUID.randomUUID() + "." + extension;

        // 3. Send the photo to Supabase Storage
        RestClient.RequestBodySpec request = restClient.post()
                .uri(supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName)
                .header("apikey", secretKey)
                .contentType(MediaType.parseMediaType(type));

        if (secretKey.startsWith("eyJ")) {
            // only needed for the OLD-style "service_role" key
            request.header("Authorization", "Bearer " + secretKey);
        }

        try {
            request.body(file.getBytes()).retrieve().toBodilessEntity();
        } catch (RestClientException e) {
            log.error("Supabase upload failed", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Photo upload failed. Please try again.");
        }

        // 4. The public link anyone can open
        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
    }
}
