package com.ws101.surio.ecommerceapi.controller;

import com.ws101.surio.ecommerceapi.model.Product;
import com.ws101.surio.ecommerceapi.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }
    
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    @PatchMapping("/{id}")
    public Product patchProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.patchProduct(id, product)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
    
    @GetMapping("/filter")
    public List<Product> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String name) {
        
        if (category != null) {
            return productService.filterByCategory(category);
        } else if (minPrice != null && maxPrice != null) {
            return productService.filterByPriceRange(minPrice, maxPrice);
        } else if (name != null) {
            return productService.filterByName(name);
        }
        return productService.getAllProducts();
    }
}