package com.athukorala.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
@Data
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double discountValue;
    private String discountType;
    private LocalDate startDate;
    private LocalDate endDate;

    // Fixed: Initialized as true so new promotions start active
    private boolean active = true;

    private String targetType;
    private Long targetId;
}