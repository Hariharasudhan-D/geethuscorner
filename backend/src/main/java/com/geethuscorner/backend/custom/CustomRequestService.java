package com.geethuscorner.backend.custom;

import com.geethuscorner.backend.NotFoundException;
import com.geethuscorner.backend.user.User;
import com.geethuscorner.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomRequestService {

    private final CustomRequestRepository customRequestRepository;
    private final UserRepository userRepository;

    // CUSTOMER: send a new request
    @Transactional
    public CustomRequestResponse create(String email, CustomRequestForm form) {

        // Special cakes need time
        if (form.neededDate().isBefore(LocalDate.now().plusDays(2))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Custom cakes need at least 2 days' notice");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        CustomRequest request = new CustomRequest();
        request.setUser(user);
        request.setOccasion(form.occasion().trim());
        request.setFlavour(form.flavour().trim());
        request.setWeight(form.weight().trim());
        request.setNeededDate(form.neededDate());
        request.setDescription(form.description().trim());
        request.setBudget(form.budget());

        return CustomRequestResponse.from(customRequestRepository.save(request));
    }

    // CUSTOMER: my requests
    @Transactional(readOnly = true)
    public List<CustomRequestResponse> getMine(String email) {
        return customRequestRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(CustomRequestResponse::from)
                .toList();
    }

    // ADMIN: all requests
    @Transactional(readOnly = true)
    public List<CustomRequestResponse> getAll() {
        return customRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(CustomRequestResponse::from)
                .toList();
    }

    // ADMIN: reply (accept with a price, or reject)
    @Transactional
    public CustomRequestResponse reply(Long id, CustomReplyForm form) {
        CustomRequest request = customRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Request not found with id " + id));

        request.setStatus(form.status());
        request.setQuotedPrice(form.quotedPrice());
        request.setAdminReply(form.adminReply() == null ? null : form.adminReply().trim());

        return CustomRequestResponse.from(customRequestRepository.save(request));
    }
}
