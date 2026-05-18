import java.math.BigDecimal;

public class CheckingAccount extends Account {
    private static final double OVERDRAFT_FEE = 35.0;
    
    public CheckingAccount(String accountNumber, BigDecimal initialBalance) {
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
        
        BigDecimal totalNeeded = amount;
        if (amount.compareTo(balance) > 0) {
            totalNeeded = amount.add(BigDecimal.valueOf(OVERDRAFT_FEE));
            System.out.println("Warning: Overdraft! ₱" + OVERDRAFT_FEE + " fee applied.");
        }
        
        if (totalNeeded.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Insufficient funds including overdraft fee. Available: ₱" + balance);
        }
        
        balance = balance.subtract(totalNeeded);
        System.out.println("Withdrew: ₱" + amount);
    }
}