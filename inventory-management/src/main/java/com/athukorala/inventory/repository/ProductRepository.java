package com.athukorala.inventory.repository;

import com.athukorala.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // You can add custom finders here later, like finding by category
}