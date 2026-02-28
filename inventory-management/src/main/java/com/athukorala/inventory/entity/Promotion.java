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
    private String discountType; // 'PERCENTAGE' or 'FIXED_AMOUNT'
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive = true;
    private String targetType; // 'PRODUCT' or 'CATEGORY'
    private Long targetId;
}