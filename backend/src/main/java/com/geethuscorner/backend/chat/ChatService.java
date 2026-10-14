package com.geethuscorner.backend.chat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Map;

@Slf4j
@Service
public class ChatService {

    // The shape of FastAPI's answer: { "response": "..." }
    public record AiAnswer(String response) {
    }

    private final RestClient restClient;
    private final String aiUrl;
    private final String secret;

    public ChatService(@Value("${app.ai.url}") String aiUrl,
                       @Value("${app.ai.secret}") String secret) {

        // How long we wait for the AI
        SimpleClientHttpRequestFactory timeouts = new SimpleClientHttpRequestFactory();
        timeouts.setConnectTimeout(Duration.ofSeconds(10));   // to connect
        timeouts.setReadTimeout(Duration.ofSeconds(60));      // for the answer (the AI may be waking up)

        this.restClient = RestClient.builder().requestFactory(timeouts).build();
        this.aiUrl = aiUrl;
        this.secret = secret;
    }

    // Send the question to FastAPI and return the answer text
    public String ask(String message) {
        if (secret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "The cake assistant is not set up yet");
        }

        try {
            AiAnswer answer = restClient.post()
                    .uri(aiUrl + "/chat")
                    .header("X-Chat-Secret", secret)               // the password only we know
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message", message.trim()))
                    .retrieve()
                    .body(AiAnswer.class);

            if (answer == null || answer.response() == null || answer.response().isBlank()) {
                throw new RestClientException("Empty answer from the AI");
            }
            return answer.response();

        } catch (RestClientException e) {
            log.error("Cake assistant failed", e);   // details for you in the logs
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Our cake assistant is taking a short break. Please try again in a minute 🙂");
        }
    }
}
