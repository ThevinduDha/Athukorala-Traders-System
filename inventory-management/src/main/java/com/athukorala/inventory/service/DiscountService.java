package com.athukorala.inventory.service;

import com.athukorala.inventory.entity.Product;
import com.athukorala.inventory.entity.Promotion;
import com.athukorala.inventory.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountService {

    @Autowired
    private PromotionRepository promotionRepository;

    public Double calculateDiscountedPrice(Product product) {
        LocalDate today = LocalDate.now();

        // Fetch all currently active campaigns within the valid date range
        List<Promotion> activeCampaigns = promotionRepository.findAll().stream()
                .filter(p -> p.isActive() &&
                        !today.isBefore(p.getStartDate()) &&
                        !today.isAfter(p.getEndDate()))
                .toList();

        if (activeCampaigns.isEmpty()) return product.getBasePrice();

        // 1. Check for a SPECIFIC Product Discount first (High Priority)
        Optional<Promotion> specificDiscount = activeCampaigns.stream()
                .filter(p -> "PRODUCT".equals(p.getTargetType()) &&
                        product.getId().equals(p.getTargetId()))
                .findFirst();

        // 2. Fallback to GLOBAL Store-wide Promotion (Medium Priority)
        Optional<Promotion> globalPromo = activeCampaigns.stream()
                .filter(p -> "GLOBAL".equals(p.getTargetType()))
                .findFirst();

        // Determine which promotion to apply
        Promotion selectedPromo = specificDiscount.orElse(globalPromo.orElse(null));

        if (selectedPromo == null) return product.getBasePrice();

        return applyDiscountCalculation(product.getBasePrice(), selectedPromo);
    }

    private Double applyDiscountCalculation(Double basePrice, Promotion promo) {
        if ("PERCENTAGE".equals(promo.getDiscountType())) {
            // Formula: Base - (Base * %)
            return basePrice * (1 - (promo.getDiscountValue() / 100.0));
        } else {
            // Formula: Base - Fixed Amount (Ensuring price never goes below 0)
            return Math.max(0.0, basePrice - promo.getDiscountValue());
        }
    }
}