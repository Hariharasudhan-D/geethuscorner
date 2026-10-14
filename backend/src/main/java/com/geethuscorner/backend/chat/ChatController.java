package com.geethuscorner.backend.chat;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // POST /api/chat → ask the cake assistant (logged-in customers only)
    @PostMapping("/api/chat")
    public Map<String, String> chat(@Valid @RequestBody ChatRequest request) {
        return Map.of("response", chatService.ask(request.message()));
    }
}
