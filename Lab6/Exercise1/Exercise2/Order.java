package Exercise2;

import java.math.BigDecimal;

public class Order {
    private Long orderId;
    private String description;
    private BigDecimal amount;
    
    public Order(Long orderId, String description, BigDecimal amount) {
        this.orderId = orderId;
        this.description = description;
        this.amount = amount;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public String getDescription() {
        return description;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    @Override
    public String toString() {
        return "Order[orderId=" + orderId + ", description=" + description + ", amount=" + amount + "]";
    }
}