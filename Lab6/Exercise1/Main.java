import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        System.out.println("================================================");
        System.out.println("BANK ACCOUNT SYSTEM TEST");
        System.out.println("================================================");
        
        System.out.println("\n--- SAVINGS ACCOUNT ---");
        try {
            SavingsAccount savings = new SavingsAccount("SAV-001", new BigDecimal("1000.00"));
            savings.displayBalance();
            
            savings.deposit(new BigDecimal("500.00"));
            savings.displayBalance();
            
            savings.withdraw(new BigDecimal("200.00"));
            savings.displayBalance();
            
            System.out.println("Interest earned: ₱" + savings.calculateInterest());
            
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        System.out.println("\n--- CHECKING ACCOUNT ---");
        try {
            CheckingAccount checking = new CheckingAccount("CHK-001", new BigDecimal("500.00"));
            checking.displayBalance();
            
            checking.deposit(new BigDecimal("300.00"));
            checking.displayBalance();
            
            checking.withdraw(new BigDecimal("400.00"));
            checking.displayBalance();
            
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        System.out.println("\n================================================");
        System.out.println("TEST COMPLETE");
    }
}