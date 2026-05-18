import java.math.BigDecimal;

public abstract class Account {
    protected String accountNumber;
    protected BigDecimal balance;
    
    public Account(String accountNumber, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    public abstract void deposit(BigDecimal amount) throws InvalidInputException;
    public abstract void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException;
    
    public BigDecimal getBalance() {
        return balance;
    }
    
    public void displayBalance() {
        System.out.println("Account " + accountNumber + " Balance: ₱" + balance);
    }
}