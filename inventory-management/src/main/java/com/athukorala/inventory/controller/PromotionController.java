package com.athukorala.inventory.controller;

import com.athukorala.inventory.entity.Promotion;
import com.athukorala.inventory.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000") // Connects to React
public class PromotionController {

    @Autowired
    private PromotionRepository repository;

    @GetMapping
    public List<Promotion> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Promotion create(@RequestBody Promotion promotion) {
        return repository.save(promotion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}