package com.geethuscorner.backend.image;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/images")   // under /api/admin → ADMIN only
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    // POST /api/admin/images (a form with a "file") → { "url": "https://..." }
    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return Map.of("url", imageService.upload(file));
    }
}
