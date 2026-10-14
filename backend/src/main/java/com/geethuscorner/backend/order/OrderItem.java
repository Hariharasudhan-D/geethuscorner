package com.geethuscorner.backend.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which slip this line belongs to
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private Long cakeId;          // which cake (just the number)

    @Column(nullable = false, length = 100)
    private String cakeName;      // COPY of the name at order time

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;     // COPY of the price at order time

    @Column(nullable = false)
    private int quantity;
}
