package com.geethuscorner.backend.order;

import com.geethuscorner.backend.booking.BookingService;
import com.geethuscorner.backend.cake.Cake;
import com.geethuscorner.backend.cake.CakeRepository;
import com.geethuscorner.backend.user.User;
import com.geethuscorner.backend.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)   // fake repositories, no real database needed
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock UserRepository userRepository;
    @Mock CakeRepository cakeRepository;
    @Mock BookingService bookingService;

    @InjectMocks OrderService orderService;   // the REAL service, with the fakes plugged in

    private final Cake redVelvet = new Cake();

    @BeforeEach   // runs before EACH test
    void setUp() {
        User hari = new User();
        hari.setName("Hari");
        hari.setEmail("hari@test.com");
        hari.setPhone("9876543210");
        when(userRepository.findByEmail("hari@test.com")).thenReturn(Optional.of(hari));

        redVelvet.setId(1L);
        redVelvet.setName("Red Velvet");
        redVelvet.setPrice(new BigDecimal("700"));
        when(cakeRepository.findById(1L)).thenReturn(Optional.of(redVelvet));
    }

    // An order for 2 Red Velvets (pickup, the day after tomorrow)
    private OrderRequest twoRedVelvets() {
        return new OrderRequest(
                List.of(new OrderRequest.Item(1L, 2)),
                DeliveryType.PICKUP, null, LocalDate.now().plusDays(2),
                TimeSlot.MORNING, PaymentMethod.CASH, null);
    }

    @Test
    void totalComesFromDatabasePrices() {
        redVelvet.setAvailable(true);
        when(orderRepository.save(any(Order.class))).thenAnswer(call -> call.getArgument(0));

        OrderResponse response = orderService.placeOrder("hari@test.com", twoRedVelvets());

        assertThat(response.total()).isEqualByComparingTo("1400");   // 700 × 2
        assertThat(response.status()).isEqualTo(OrderStatus.PENDING);
    }

    @Test
    void soldOutCakeIsRejected() {
        redVelvet.setAvailable(false);

        assertThrows(ResponseStatusException.class,
                () -> orderService.placeOrder("hari@test.com", twoRedVelvets()));
    }
}
