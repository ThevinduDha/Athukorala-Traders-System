package com.athukorala.inventory.service;

import com.athukorala.inventory.entity.Product;
import com.athukorala.inventory.entity.Promotion;
import com.athukorala.inventory.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class DiscountService {

    @Autowired
    private PromotionRepository promotionRepository;

    public Double calculateDiscountedPrice(Product product) {
        LocalDate today = LocalDate.now();

        // Find if any active promotion targets this specific product ID
        List<Promotion> activePromos = promotionRepository.findAll().stream()
                .filter(p -> p.isActive() &&
                        (p.getTargetId() != null && p.getTargetId().equals(product.getId())) &&
                        !today.isBefore(p.getStartDate()) && !today.isAfter(p.getEndDate()))
                .toList();

        if (activePromos.isEmpty()) return product.getBasePrice();

        Promotion promo = activePromos.get(0);
        if ("PERCENTAGE".equals(promo.getDiscountType())) {
            return product.getBasePrice() * (1 - (promo.getDiscountValue() / 100));
        } else {
            return Math.max(0, product.getBasePrice() - promo.getDiscountValue());
        }
    }
}