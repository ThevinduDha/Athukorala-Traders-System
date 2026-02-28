package com.athukorala.inventory.controller;

import com.athukorala.inventory.entity.Promotion;
import com.athukorala.inventory.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    @Autowired
    private PromotionRepository repository;

    @GetMapping
    public List<Promotion> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Promotion create(@RequestBody Promotion promotion) {
        promotion.setActive(true);
        return repository.save(promotion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotionDetails) {
        Promotion promotion = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));

        promotion.setName(promotionDetails.getName());
        promotion.setDiscountValue(promotionDetails.getDiscountValue());
        promotion.setDiscountType(promotionDetails.getDiscountType());
        promotion.setStartDate(promotionDetails.getStartDate());
        promotion.setEndDate(promotionDetails.getEndDate());
        promotion.setTargetType(promotionDetails.getTargetType());
        promotion.setActive(promotionDetails.isActive());

        return ResponseEntity.ok(repository.save(promotion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}