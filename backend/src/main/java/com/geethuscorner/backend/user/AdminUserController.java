package com.geethuscorner.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    // GET /api/admin/users → all customers (ADMIN only)
    @GetMapping("/api/admin/users")
    public List<UserSummary> getAllUsers() {
        return userService.getAllUsers();
    }
}
