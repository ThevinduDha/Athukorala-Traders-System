package com.athukorala.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double basePrice; // Original price before any engine logic
    private Integer stockQuantity;
    private String category; // e.g., 'Power Tools', 'Safety Gear'
    private String imageUrl;
}