package com.geethuscorner.backend.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders → place an order (wristband required)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(Authentication authentication,
                                    @Valid @RequestBody OrderRequest request) {
        return orderService.placeOrder(authentication.getName(), request);
    }

    // GET /api/orders/my → my own orders only
    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        return orderService.getMyOrders(authentication.getName());
    }
}
