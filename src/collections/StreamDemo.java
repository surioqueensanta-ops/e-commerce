package collections;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

public class StreamDemo {
    
    private static final Random random = new Random();
    
    public static void main(String[] args) {
        System.out.println("=".repeat(70));
        System.out.println("          COLLECTIONS & STREAMS API DEMONSTRATION");
        System.out.println("=".repeat(70));
        
        List<Order> orders = generateOrders(10);
        
        System.out.println("\n📋 TASK 1: All Orders");
        System.out.println("-".repeat(50));
        printAllOrders(orders);
        
        System.out.println("\n📋 TASK 2: Add Order & Sort by Amount (Descending)");
        System.out.println("-".repeat(50));
        List<Order> modifiedOrders = addAndSortOrders(orders);
        
        System.out.println("\n📋 TASK 3: Orders > ₱150 (Descriptions only)");
        System.out.println("-".repeat(50));
        filterOrdersByAmount(modifiedOrders);
        
        System.out.println("\n📋 TASK 4: Average Order Amount");
        System.out.println("-".repeat(50));
        calculateAverageAmount(modifiedOrders);
        
        System.out.println("\n📋 TASK 5: Group by Description - Total Amounts");
        System.out.println("-".repeat(50));
        groupAndSumByDescription(modifiedOrders);
    }
    
    public static List<Order> generateOrders(int numberOfOrders) {
        if (numberOfOrders < 1) {
            throw new IllegalArgumentException("Number of orders must be at least 1");
        }
        
        List<Order> orders = new ArrayList<>();
        String[] descriptions = {"Electronics", "Clothing", "Books", "Food", 
                                  "Toys", "Sports", "Music", "Movies", "Games", "Tools"};
        
        for (int i = 0; i < numberOfOrders; i++) {
            Long orderId = (long) (random.nextInt(100) + 1);
            String description = descriptions[random.nextInt(descriptions.length)];
            double amount = 50 + random.nextDouble() * 150;
            BigDecimal roundedAmount = BigDecimal.valueOf(amount).setScale(2, RoundingMode.HALF_UP);
            
            orders.add(new Order(orderId, description, roundedAmount));
        }
        
        return orders;
    }
    
    public static void printAllOrders(List<Order> orders) {
        System.out.printf("%-10s %-20s %-10s%n", "Order ID", "Description", "Amount");
        System.out.println("-".repeat(45));
        
        orders.forEach(order -> 
            System.out.printf("%-10d %-20s ₱%-10.2f%n", 
                order.orderId(), 
                order.description(), 
                order.amount())
        );
        
        System.out.println("\nTotal Orders: " + orders.size());
    }
    
    public static List<Order> addAndSortOrders(List<Order> originalOrders) {
        List<Order> orders = new ArrayList<>(originalOrders);
        
        Order newOrder = new Order(999L, "Premium Item", 299.99);
        orders.add(newOrder);
        System.out.println("Added new order: " + newOrder);
        
        orders.sort((o1, o2) -> o2.amount().compareTo(o1.amount()));
        
        System.out.println("\nSorted Orders (Highest to Lowest):");
        System.out.printf("%-10s %-20s %-10s%n", "Order ID", "Description", "Amount");
        System.out.println("-".repeat(45));
        
        orders.forEach(order -> 
            System.out.printf("%-10d %-20s ₱%-10.2f%n", 
                order.orderId(), 
                order.description(), 
                order.amount())
        );
        
        return orders;
    }
    
    public static void filterOrdersByAmount(List<Order> orders) {
        BigDecimal threshold = new BigDecimal("150.00");
        
        List<String> highValueDescriptions = orders.stream()
            .filter(order -> order.amount().compareTo(threshold) > 0)
            .map(Order::description)
            .collect(Collectors.toList());
        
        System.out.println("Orders with amount > ₱150: " + highValueDescriptions.size());
        System.out.println("Descriptions: " + highValueDescriptions);
        
        System.out.println("\nDetailed filtered orders:");
        orders.stream()
            .filter(order -> order.amount().compareTo(threshold) > 0)
            .forEach(order -> System.out.printf("  • %s - ₱%.2f%n", 
                order.description(), order.amount()));
    }
    
    public static void calculateAverageAmount(List<Order> orders) {
        OptionalDouble average = orders.stream()
            .mapToDouble(order -> order.amount().doubleValue())
            .average();
        
        if (average.isPresent()) {
            System.out.printf("Average Order Amount: ₱%.2f%n", average.getAsDouble());
        } else {
            System.out.println("No orders to calculate average");
        }
        
        BigDecimal sum = orders.stream()
            .map(Order::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal calculatedAverage = sum.divide(
            BigDecimal.valueOf(orders.size()), 
            2, 
            RoundingMode.HALF_UP
        );
        
        System.out.printf("(Calculated via sum/count): ₱%.2f%n", calculatedAverage);
        
        DoubleSummaryStatistics stats = orders.stream()
            .mapToDouble(o -> o.amount().doubleValue())
            .summaryStatistics();
        
        System.out.println("\nAmount Statistics:");
        System.out.printf("  Min: ₱%.2f%n", stats.getMin());
        System.out.printf("  Max: ₱%.2f%n", stats.getMax());
        System.out.printf("  Sum: ₱%.2f%n", stats.getSum());
        System.out.printf("  Count: %d%n", stats.getCount());
    }
    
    public static void groupAndSumByDescription(List<Order> orders) {
        Map<String, BigDecimal> totalByDescription = orders.stream()
            .collect(Collectors.groupingBy(
                Order::description,
                Collectors.mapping(
                    Order::amount,
                    Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
            ));
        
        System.out.println("Total Amount by Description:");
        System.out.printf("%-20s %-15s%n", "Description", "Total Amount");
        System.out.println("-".repeat(40));
        
        totalByDescription.entrySet().stream()
            .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
            .forEach(entry -> 
                System.out.printf("%-20s ₱%-15.2f%n", 
                    entry.getKey(), entry.getValue())
            );
        
        Optional<Map.Entry<String, BigDecimal>> highest = totalByDescription.entrySet().stream()
            .max(Map.Entry.comparingByValue());
        
        highest.ifPresent(entry -> 
            System.out.printf("\n🏆 Highest spending category: %s (₱%.2f)%n", 
                entry.getKey(), entry.getValue())
        );
    }
}