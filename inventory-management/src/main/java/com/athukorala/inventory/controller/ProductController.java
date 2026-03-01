package com.athukorala.inventory.controller;

import com.athukorala.inventory.entity.Product;
import com.athukorala.inventory.repository.ProductRepository;
import com.athukorala.inventory.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Required for React connection
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountService discountService;

    // 1. GET: Fetch all products for the Inventory Grid
    @GetMapping
    public List<ProductDTO> getInventory() {
        return productRepository.findAll().stream().map(product -> {
            Double finalPrice = discountService.calculateDiscountedPrice(product);
            String expiryDate = "2026-03-15"; // Placeholder for demo synchronization

            return new ProductDTO(
                    product,
                    finalPrice,
                    !finalPrice.equals(product.getBasePrice()),
                    String.format("Rs. %,.2f", finalPrice),
                    expiryDate
            );
        }).collect(Collectors.toList());
    }

    // 2. POST: Add new stock (This fixes your "Registration Failed" error)
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        // This takes the JSON from your React form and saves it to MySQL
        return productRepository.save(product);
    }

    // Data Transfer Object for React
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
    // 3. PUT: Update an existing product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setBasePrice(productDetails.getBasePrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());

        return productRepository.save(product);
    }

    // 4. DELETE: Remove a product from the warehouse
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}