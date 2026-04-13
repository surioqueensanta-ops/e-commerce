package collections;

import java.math.BigDecimal;
import java.math.RoundingMode;

public record Order(
    Long orderId,
    String description,
    BigDecimal amount
) {
    
    public Order {
        if (orderId == null || orderId < 0) {
            throw new IllegalArgumentException("Order ID must be positive");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description cannot be empty");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
    
    public Order(Long orderId, String description, double amount) {
        this(orderId, description, BigDecimal.valueOf(amount).setScale(2, RoundingMode.HALF_UP));
    }
    
    @Override
    public String toString() {
        return String.format("Order{id=%d, desc='%s', amount=₱%.2f}", 
            orderId, description, amount);
    }
}