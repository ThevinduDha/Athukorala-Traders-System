package com.athukorala.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "staff")
@Data // This automatically adds Getters and Setters if you use Project Lombok
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String role;
    private String phone;
}