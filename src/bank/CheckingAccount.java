package bank;

import bank.exceptions.InvalidInputException;
import bank.exceptions.InsufficientFundsException;
import java.math.BigDecimal;

public class CheckingAccount extends Account {
    
    private static final BigDecimal OVERDRAFT_LIMIT = new BigDecimal("1000.00");
    private static final BigDecimal OVERDRAFT_FEE = new BigDecimal("35.00");
    
    public CheckingAccount(String accountNumber, String accountHolderName, BigDecimal initialBalance) {
        super(accountNumber, accountHolderName, initialBalance);
    }
    
    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        validateAmount(amount);
        balance = balance.add(amount);
        System.out.printf("Deposited: ₱%.2f | New Balance: ₱%.2f%n", amount, balance);
    }
    
    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        validateAmount(amount);
        
        BigDecimal availableFunds = balance.add(OVERDRAFT_LIMIT);
        
        if (amount.compareTo(availableFunds) > 0) {
            throw new InsufficientFundsException(
                "Withdrawal exceeds overdraft limit of ₱" + OVERDRAFT_LIMIT,
                balance.doubleValue(),
                amount.doubleValue()
            );
        }
        
        BigDecimal newBalance = balance.subtract(amount);
        
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            newBalance = newBalance.subtract(OVERDRAFT_FEE);
            System.out.println("Overdraft fee of ₱" + OVERDRAFT_FEE + " applied.");
        }
        
        balance = newBalance;
        System.out.printf("Withdrew: ₱%.2f | New Balance: ₱%.2f%n", amount, balance);
        
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            System.out.println("WARNING: Account is overdrawn by ₱" + balance.abs());
        }
    }
    
    public BigDecimal getOverdraftLimit() {
        return OVERDRAFT_LIMIT;
    }
    
    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Overdraft Limit: ₱" + OVERDRAFT_LIMIT);
        System.out.println("Overdraft Fee: ₱" + OVERDRAFT_FEE);
    }
}