package com.ws101.surio.ecommerceapi.service;

import com.ws101.surio.ecommerceapi.model.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    private final List<Product> products = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    public ProductService() {
        initSampleData();
    }
    
    private void initSampleData() {
        products.add(new Product(idCounter.getAndIncrement(), "Wireless Mouse", "Ergonomic wireless mouse with smooth tracking", new BigDecimal("229"), "Electronics", 50, "mouse.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Smart Watch", "Stylish stainless steel smart watch", new BigDecimal("779"), "Electronics", 30, "watch.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Cotton T-Shirt", "100% premium cotton t-shirt", new BigDecimal("250"), "Clothing", 100, "tshirt.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Denim Pants", "Classic denim jeans perfect fit", new BigDecimal("300"), "Clothing", 80, "jeans.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Sports Shoes", "Lightweight running shoes", new BigDecimal("850"), "Footwear", 40, "shoes.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Fast Charger", "USB-C fast charging brick", new BigDecimal("299"), "Electronics", 200, "charger.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Cotton Socks", "Soft breathable cotton socks 3 pairs", new BigDecimal("99"), "Clothing", 300, "socks.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Powerbank", "10000mAh portable charger", new BigDecimal("599"), "Electronics", 60, "powerbank.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Wireless Headphones", "Noise cancelling bluetooth headphones", new BigDecimal("1299"), "Electronics", 25, "headphones.png"));
        products.add(new Product(idCounter.getAndIncrement(), "Laptop Backpack", "Water resistant 15.6 inch laptop bag", new BigDecimal("999"), "Accessories", 45, "bag.png"));
    }
    
    public List<Product> getAllProducts() {
        return new ArrayList<>(products);
    }
    
    public Optional<Product> getProductById(Long id) {
        return products.stream()
                .filter(product -> product.getId().equals(id))
                .findFirst();
    }
    
    public Product createProduct(Product product) {
        product.setId(idCounter.getAndIncrement());
        products.add(product);
        return product;
    }
    
    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return getProductById(id).map(existingProduct -> {
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setCategory(updatedProduct.getCategory());
            existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
            existingProduct.setImageUrl(updatedProduct.getImageUrl());
            return existingProduct;
        });
    }
    
    public Optional<Product> patchProduct(Long id, Product patchData) {
        return getProductById(id).map(existingProduct -> {
            if (patchData.getName() != null) existingProduct.setName(patchData.getName());
            if (patchData.getDescription() != null) existingProduct.setDescription(patchData.getDescription());
            if (patchData.getPrice() != null) existingProduct.setPrice(patchData.getPrice());
            if (patchData.getCategory() != null) existingProduct.setCategory(patchData.getCategory());
            if (patchData.getStockQuantity() != null) existingProduct.setStockQuantity(patchData.getStockQuantity());
            if (patchData.getImageUrl() != null) existingProduct.setImageUrl(patchData.getImageUrl());
            return existingProduct;
        });
    }
    
    public boolean deleteProduct(Long id) {
        return products.removeIf(product -> product.getId().equals(id));
    }
    
    public List<Product> filterByCategory(String category) {
        return products.stream()
                .filter(product -> product.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public List<Product> filterByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return products.stream()
                .filter(product -> product.getPrice().compareTo(minPrice) >= 0)
                .filter(product -> product.getPrice().compareTo(maxPrice) <= 0)
                .collect(Collectors.toList());
    }
    
    public List<Product> filterByName(String keyword) {
        return products.stream()
                .filter(product -> product.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }
} 