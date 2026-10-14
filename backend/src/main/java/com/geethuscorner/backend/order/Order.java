package com.geethuscorner.backend.order;

import com.geethuscorner.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")   // "order" is a reserved SQL word (ORDER BY), so we use "orders"
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who placed it: many orders belong to one user
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // The lines on the slip: one order has many items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryType deliveryType;

    @Column(length = 500)
    private String address;          // empty for pickup

    @Column(nullable = false, length = 15)
    private String phone;            // copied from the customer's account

    @Column(nullable = false)
    private LocalDate deliveryDate;  // the day they want the cake

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Column(length = 500)
    private String note;             // e.g. "Write Happy Birthday Amma"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;   // every new order starts as PENDING

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;        // calculated by the SERVER, never sent by the customer

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Add a line AND tell the line which slip it belongs to (both sides must know)
    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }
}
