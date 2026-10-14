package com.geethuscorner.backend.booking;

import com.geethuscorner.backend.NotFoundException;
import com.geethuscorner.backend.order.Order;
import com.geethuscorner.backend.order.OrderRepository;
import com.geethuscorner.backend.order.OrderStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final OrderRepository orderRepository;
    private final ClosedDateRepository closedDateRepository;
    private final int maxOrdersPerDay;
    private final int maxDaysAhead;

    // Spring fills the 2 numbers from application.properties
    public BookingService(OrderRepository orderRepository,
                          ClosedDateRepository closedDateRepository,
                          @Value("${app.orders.max-per-day}") int maxOrdersPerDay,
                          @Value("${app.orders.max-days-ahead}") int maxDaysAhead) {
        this.orderRepository = orderRepository;
        this.closedDateRepository = closedDateRepository;
        this.maxOrdersPerDay = maxOrdersPerDay;
        this.maxDaysAhead = maxDaysAhead;
    }

    // Can we take an order for this date? If not, throw a clear error.
    public void checkDate(LocalDate date) {
        if (date.isAfter(LocalDate.now().plusDays(maxDaysAhead))) {
            throw badRequest("We take orders up to " + maxDaysAhead + " days ahead");
        }
        if (closedDateRepository.existsByClosedOn(date)) {
            throw badRequest("Sorry, we are closed on that date. Please choose another day.");
        }
        long ordersThatDay = orderRepository.countByDeliveryDateAndStatusNot(date, OrderStatus.CANCELLED);
        if (ordersThatDay >= maxOrdersPerDay) {
            throw badRequest("Sorry, we are fully booked on that date. Please choose another day.");
        }
    }

    // For the checkout page: closed dates and full dates
    @Transactional(readOnly = true)
    public BookingInfo getBookingInfo() {
        LocalDate today = LocalDate.now();

        // 1. Upcoming closed dates
        List<LocalDate> closedDates = new ArrayList<>();
        List<ClosedDate> upcomingClosed =
                closedDateRepository.findByClosedOnGreaterThanEqualOrderByClosedOnAsc(today);
        for (ClosedDate closed : upcomingClosed) {
            closedDates.add(closed.getClosedOn());
        }

        // 2. Count upcoming orders per day (like tally marks in a notebook)
        List<Order> upcomingOrders =
                orderRepository.findByDeliveryDateGreaterThanEqualAndStatusNot(today, OrderStatus.CANCELLED);
        Map<LocalDate, Integer> ordersPerDay = new HashMap<>();
        for (Order order : upcomingOrders) {
            LocalDate date = order.getDeliveryDate();
            ordersPerDay.put(date, ordersPerDay.getOrDefault(date, 0) + 1);
        }

        // 3. Days that reached the limit
        List<LocalDate> fullDates = new ArrayList<>();
        for (Map.Entry<LocalDate, Integer> day : ordersPerDay.entrySet()) {
            if (day.getValue() >= maxOrdersPerDay) {
                fullDates.add(day.getKey());
            }
        }

        return new BookingInfo(maxDaysAhead, closedDates, fullDates);
    }

    // ---------- ADMIN: holidays ----------

    @Transactional(readOnly = true)
    public List<ClosedDate> getClosedDates() {
        return closedDateRepository.findByClosedOnGreaterThanEqualOrderByClosedOnAsc(LocalDate.now());
    }

    @Transactional
    public ClosedDate addClosedDate(ClosedDateRequest request) {
        if (closedDateRepository.existsByClosedOn(request.closedOn())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This date is already closed");
        }
        ClosedDate closed = new ClosedDate();
        closed.setClosedOn(request.closedOn());
        closed.setReason(request.reason() == null ? null : request.reason().trim());
        return closedDateRepository.save(closed);
    }

    @Transactional
    public void deleteClosedDate(Long id) {
        ClosedDate closed = closedDateRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Closed date not found"));
        closedDateRepository.delete(closed);
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
