package com.athukorala.inventory.repository;

import com.athukorala.inventory.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    // This allows you to Save, Delete, and Find promotions automatically
}