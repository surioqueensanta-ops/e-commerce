import java.math.BigDecimal;

public class SavingsAccount extends Account implements InterestBearing {
    private static final double INTEREST_RATE = 0.05; // 5% interest
    
    public SavingsAccount(String accountNumber, BigDecimal initialBalance) {
        super(accountNumber, initialBalance);
    }
    
    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Deposit amount must be positive");
        }
        balance = balance.add(amount);
        System.out.println("Deposited: ₱" + amount);
    }
    
    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Withdrawal amount must be positive");
        }
        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Insufficient funds. Available: ₱" + balance);
        }
        balance = balance.subtract(amount);
        System.out.println("Withdrew: ₱" + amount);
    }
    
    @Override
    public double calculateInterest() {
        return balance.doubleValue() * INTEREST_RATE;
    }
}