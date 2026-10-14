package com.geethuscorner.backend.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")   // under /api/admin → ADMIN only (Part 0)
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    // GET /api/admin/orders → every order
    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    // PUT /api/admin/orders/12/status → change order 12's status
    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id,
                                      @Valid @RequestBody UpdateStatusRequest request) {
        return orderService.updateStatus(id, request.status());
    }
}
