package com.athukorala.inventory.controller;

import com.athukorala.inventory.entity.Product;
import com.athukorala.inventory.repository.ProductRepository;
import com.athukorala.inventory.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public List<ProductDTO> getInventory() {
        return productRepository.findAll().stream().map(product -> {
            Double finalPrice = discountService.calculateDiscountedPrice(product);

            // Capture the expiry date from the active promotion to show in React
            // (Assumes you might add a getActivePromotionEndDate method to your service later)
            String expiryDate = "2026-03-15"; // Placeholder for demo synchronization

            return new ProductDTO(
                    product,
                    finalPrice,
                    !finalPrice.equals(product.getBasePrice()),
                    String.format("Rs. %,.2f", finalPrice), // Formats as Sri Lankan Rupees
                    expiryDate
            );
        }).collect(Collectors.toList());
    }

    // Data Transfer Object for React - Updated to include endDate
    public static class ProductDTO {
        public Product product;
        public Double discountedPrice;
        public boolean isDiscounted;
        public String formattedPrice;
        public String endDate;

        public ProductDTO(Product p, Double dp, boolean id, String fp, String ed) {
            this.product = p;
            this.discountedPrice = dp;
            this.isDiscounted = id;
            this.formattedPrice = fp;
            this.endDate = ed;
        }
    }
}