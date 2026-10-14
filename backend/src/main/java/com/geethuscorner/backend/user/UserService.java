package com.geethuscorner.backend.user;

import com.geethuscorner.backend.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    // ADMIN: every user, newest first, with their number of orders
    @Transactional(readOnly = true)
    public List<UserSummary> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(user -> new UserSummary(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.getCreatedAt(),
                        orderRepository.countByUserId(user.getId())
                ))
                .toList();
    }
}
