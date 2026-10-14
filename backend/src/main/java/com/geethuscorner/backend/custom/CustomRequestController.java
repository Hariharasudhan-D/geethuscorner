package com.geethuscorner.backend.custom;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CustomRequestController {

    private final CustomRequestService customRequestService;

    // ---------- CUSTOMER (logged in) ----------

    @PostMapping("/api/custom-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomRequestResponse create(Authentication authentication,
                                        @Valid @RequestBody CustomRequestForm form) {
        return customRequestService.create(authentication.getName(), form);
    }

    @GetMapping("/api/custom-requests/my")
    public List<CustomRequestResponse> getMine(Authentication authentication) {
        return customRequestService.getMine(authentication.getName());
    }

    // ---------- ADMIN ----------

    @GetMapping("/api/admin/custom-requests")
    public List<CustomRequestResponse> getAll() {
        return customRequestService.getAll();
    }

    @PutMapping("/api/admin/custom-requests/{id}")
    public CustomRequestResponse reply(@PathVariable Long id, @Valid @RequestBody CustomReplyForm form) {
        return customRequestService.reply(id, form);
    }
}
