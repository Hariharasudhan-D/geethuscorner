package com.geethuscorner.backend.order;

import com.geethuscorner.backend.NotFoundException;
import com.geethuscorner.backend.booking.BookingService;
import com.geethuscorner.backend.cake.Cake;
import com.geethuscorner.backend.cake.CakeRepository;
import com.geethuscorner.backend.user.User;
import com.geethuscorner.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CakeRepository cakeRepository;
    private final BookingService bookingService;   // the calendar keeper

    // PLACE AN ORDER
    @Transactional   // all or nothing: the order and ALL its items are saved together, or none
    public OrderResponse placeOrder(String email, OrderRequest request) {

        // 1. Who is ordering? (the email comes from the wristband, not from the form)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // 2. Delivery needs an address
        boolean isDelivery = request.deliveryType() == DeliveryType.DELIVERY;
        if (isDelivery && (request.address() == null || request.address().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address is required for delivery");
        }

        // Is this date open, not full, not too far away?
        bookingService.checkDate(request.deliveryDate());

        // 3. Fill in the slip
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryType(request.deliveryType());
        order.setAddress(isDelivery ? request.address().trim() : null);
        order.setPhone(user.getPhone());
        order.setDeliveryDate(request.deliveryDate());
        order.setTimeSlot(request.timeSlot());
        order.setPaymentMethod(request.paymentMethod());
        order.setNote(request.note() == null ? null : request.note().trim());

        // 4. Add each cake. Name and PRICE come from OUR database, never from the customer.
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.Item itemRequest : request.items()) {
            Cake cake = cakeRepository.findById(itemRequest.cakeId())
                    .orElseThrow(() -> new NotFoundException("Cake not found with id " + itemRequest.cakeId()));

            // Sold out? Reject, even if someone uses Postman
            if (!cake.isAvailable()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        cake.getName() + " is sold out. Please remove it from your cart.");
            }

            OrderItem item = new OrderItem();
            item.setCakeId(cake.getId());
            item.setCakeName(cake.getName());
            item.setPrice(cake.getPrice());
            item.setQuantity(itemRequest.quantity());
            order.addItem(item);

            // total = total + (price × quantity)
            BigDecimal lineTotal = cake.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            total = total.add(lineTotal);
        }

        order.setTotal(total);

        // 5. Save (the items are saved too, thanks to cascade)
        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    // MY ORDERS (newest first)
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String email) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(OrderResponse::from)
                .toList();
    }

    // ADMIN: all orders, newest first
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::from)
                .toList();
    }

    // ADMIN: move an order to a new status
    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id " + id));

        // Delivered or cancelled = finished. They can't change any more.
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Order #" + id + " is already " + order.getStatus().name().toLowerCase());
        }

        order.setStatus(newStatus);
        return OrderResponse.from(orderRepository.save(order));
    }

    // CUSTOMER: cancel my own order, only while it is still PENDING
    @Transactional
    public OrderResponse cancelMyOrder(String email, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id " + id));

        // Someone else's order? Act as if it doesn't exist.
        if (!order.getUser().getEmail().equals(email)) {
            throw new NotFoundException("Order not found with id " + id);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This order is already confirmed. Please call us to cancel it.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return OrderResponse.from(orderRepository.save(order));
    }
}
