package Exercise2;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class OrderProcessor {
    public static void main(String[] args) {
        System.out.println("============================================================");
        System.out.println("ORDER PROCESSING SYSTEM");
        System.out.println("============================================================");
        
        System.out.println("\n--- TASK 1: All Orders ---");
        List<Order> orders = OrderGenerator.generateOrders(10);
        orders.forEach(System.out::println);
        
        System.out.println("\n--- TASK 2: Sorted by Amount (Descending) ---");
        Order newOrder = new Order(11L, "Gaming Chair", new BigDecimal("15000"));
        orders.add(newOrder);
        
        List<Order> sortedOrders = orders.stream()
                .sorted((o1, o2) -> o2.getAmount().compareTo(o1.getAmount()))
                .toList();
        sortedOrders.forEach(System.out::println);
        
        System.out.println("\n--- TASK 3: Orders > ₱5000 (Descriptions only) ---");
        List<String> highValueDescriptions = orders.stream()
                .filter(order -> order.getAmount().compareTo(new BigDecimal("5000")) > 0)
                .map(Order::getDescription)
                .toList();
        highValueDescriptions.forEach(System.out::println);
        
        System.out.println("\n--- TASK 4: Average Order Amount ---");
        double averageAmount = orders.stream()
                .mapToDouble(order -> order.getAmount().doubleValue())
                .average()
                .orElse(0.0);
        System.out.printf("Average Amount: ₱%.2f%n", averageAmount);
        
        System.out.println("\n--- TASK 5: Group by Description (Total per item) ---");
        Map<String, BigDecimal> totalByDescription = orders.stream()
                .collect(Collectors.groupingBy(
                        Order::getDescription,
                        Collectors.mapping(Order::getAmount, 
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));
        
        totalByDescription.forEach((desc, total) -> 
                System.out.printf("%s: ₱%.2f%n", desc, total.doubleValue()));
        
        System.out.println("\n============================================================");
        System.out.println("PROCESSING COMPLETE");
    }
}