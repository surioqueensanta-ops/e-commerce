package com.ws101.surio.ecommerceapi.model;

import java.math.BigDecimal;

public class Product {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Integer stockQuantity;
    private String imageUrl;
    
    public Product() {}
    
    public Product(Long id, String name, String description, BigDecimal price, String category, Integer stockQuantity, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getCategory() { return category; }
    public Integer getStockQuantity() { return stockQuantity; }
    public String getImageUrl() { return imageUrl; }
    
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCategory(String category) { this.category = category; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}