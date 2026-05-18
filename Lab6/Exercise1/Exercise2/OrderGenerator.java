package Exercise2;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class OrderGenerator {
    private static final Random random = new Random();
    
    public static List<Order> generateOrders(int numberOfOrders) {
        if (numberOfOrders < 1) {
            throw new IllegalArgumentException("Number of orders must be at least 1");
        }
        List<Order> orders = new ArrayList<>();
        String[] descriptions = {"Laptop", "Mouse", "Keyboard", "Monitor", "Headphones", 
                                  "Phone", "Tablet", "Charger", "Speaker", "Camera"};
        for (int i = 1; i <= numberOfOrders; i++) {
            long orderId = (long) i;
            String description = descriptions[random.nextInt(descriptions.length)];
            BigDecimal amount = BigDecimal.valueOf(random.nextInt(20000) + 100);
            orders.add(new Order(orderId, description, amount));
        }
        return orders;
    }
}