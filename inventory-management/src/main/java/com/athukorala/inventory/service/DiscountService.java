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

        // Fetch all currently active and enabled campaigns
        List<Promotion> activeCampaigns = promotionRepository.findAll().stream()
                .filter(p -> p.isActive() &&
                        !today.isBefore(p.getStartDate()) &&
                        !today.isAfter(p.getEndDate()) &&
                        ("GLOBAL".equals(p.getTargetType()) ||
                                (product.getId().equals(p.getTargetId()) && "PRODUCT".equals(p.getTargetType()))))
                .toList();

        if (activeCampaigns.isEmpty()) return product.getBasePrice();

        // 1. Find the MAX percentage discount
        double maxPercentage = activeCampaigns.stream()
                .filter(p -> "PERCENTAGE".equals(p.getDiscountType()))
                .mapToDouble(Promotion::getDiscountValue)
                .max().orElse(0.0);

        // 2. Find the MAX fixed amount discount
        double maxFixed = activeCampaigns.stream()
                .filter(p -> "FIXED_AMOUNT".equals(p.getDiscountType()))
                .mapToDouble(Promotion::getDiscountValue)
                .max().orElse(0.0);

        // 3. Calculate both possible prices
        double priceWithPercent = product.getBasePrice() * (1 - (maxPercentage / 100.0));
        double priceWithFixed = Math.max(0.0, product.getBasePrice() - maxFixed);

        // 4. Return the LOWEST price (Best deal for the customer)
        return Math.min(priceWithPercent, priceWithFixed);
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