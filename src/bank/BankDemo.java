package bank;

import bank.exceptions.InvalidInputException;
import bank.exceptions.InsufficientFundsException;
import java.math.BigDecimal;

public class BankDemo {
    
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("          BANKING SYSTEM DEMONSTRATION");
        System.out.println("=".repeat(60));
        
        System.out.println("\n--- SAVINGS ACCOUNT DEMO ---");
        testSavingsAccount();
        
        System.out.println("\n--- CHECKING ACCOUNT DEMO ---");
        testCheckingAccount();
        
        System.out.println("\n--- POLYMORPHISM DEMO ---");
        testPolymorphism();
        
        System.out.println("\n--- EXCEPTION HANDLING DEMO ---");
        testExceptionHandling();
    }
    
    private static void testSavingsAccount() {
        try {
            SavingsAccount savings = new SavingsAccount(
                "SAV-001", 
                "Queensanta", 
                new BigDecimal("10000.00")
            );
            
            savings.displayInfo();
            System.out.println();
            
            savings.deposit(new BigDecimal("2500.00"));
            savings.withdraw(new BigDecimal("1500.00"));
            savings.withdraw(new BigDecimal("2000.00"));
            savings.withdraw(new BigDecimal("3000.00"));
            
            System.out.println("\n--- Applying Interest ---");
            savings.applyInterest();
            savings.displayInfo();
            
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    private static void testCheckingAccount() {
        try {
            CheckingAccount checking = new CheckingAccount(
                "CHK-001",
                "Charmel Javier",
                new BigDecimal("5000.00")
            );
            
            checking.displayInfo();
            System.out.println();
            
            checking.deposit(new BigDecimal("1000.00"));
            checking.withdraw(new BigDecimal("2000.00"));
            
            System.out.println("\n--- Testing Overdraft ---");
            checking.withdraw(new BigDecimal("5000.00"));
            
            checking.displayInfo();
            
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    private static void testPolymorphism() {
        Account[] accounts = {
            new SavingsAccount("SAV-002", "Chris brown", new BigDecimal("25000.00")),
            new CheckingAccount("CHK-002", "Justin bieber", new BigDecimal("8000.00")),
            new SavingsAccount("SAV-003", "Selena Gomez", new BigDecimal("15000.00"))
        };
        
        System.out.println("Processing multiple accounts polymorphically:");
        System.out.println("-".repeat(40));
        
        for (Account account : accounts) {
            System.out.println("\nAccount: " + account.getAccountNumber());
            System.out.println("Holder: " + account.getAccountHolderName());
            System.out.println("Balance: ₱" + account.getBalance());
            
            if (account instanceof InterestBearing) {
                InterestBearing interestAccount = (InterestBearing) account;
                System.out.println("Interest Rate: " + (interestAccount.getInterestRate() * 100) + "%");
                System.out.println("Calculated Interest: ₱" + interestAccount.calculateInterest());
            }
        }
    }
    
    private static void testExceptionHandling() {
        try {
            SavingsAccount account = new SavingsAccount(
                "SAV-ERROR",
                "Test User",
                new BigDecimal("1000.00")
            );
            
            System.out.println("\nTest 1: Depositing negative amount");
            try {
                account.deposit(new BigDecimal("-500.00"));
            } catch (InvalidInputException e) {
                System.err.println("✓ Caught: " + e.getMessage());
            }
            
            System.out.println("\nTest 2: Depositing null amount");
            try {
                account.deposit(null);
            } catch (InvalidInputException e) {
                System.err.println("✓ Caught: " + e.getMessage());
            }
            
            System.out.println("\nTest 3: Withdrawing more than balance");
            try {
                account.withdraw(new BigDecimal("2000.00"));
            } catch (InsufficientFundsException e) {
                System.err.println("✓ Caught: " + e.getMessage());
                System.out.println("  Available: ₱" + e.getAvailableBalance());
                System.out.println("  Requested: ₱" + e.getRequestedAmount());
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
        }
    }
}