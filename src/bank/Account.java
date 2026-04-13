package bank;

import bank.exceptions.InvalidInputException;
import bank.exceptions.InsufficientFundsException;
import java.math.BigDecimal;
import java.math.RoundingMode;

public abstract class Account {
    
    protected BigDecimal balance;
    protected String accountNumber;
    protected String accountHolderName;
    
    public Account(String accountNumber, String accountHolderName, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = initialBalance != null ? initialBalance : BigDecimal.ZERO;
    }
    
    public BigDecimal getBalance() {
        return balance.setScale(2, RoundingMode.HALF_UP);
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public String getAccountHolderName() {
        return accountHolderName;
    }
    
    public abstract void deposit(BigDecimal amount) throws InvalidInputException;
    
    public abstract void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException;
    
    protected void validateAmount(BigDecimal amount) throws InvalidInputException {
        if (amount == null) {
            throw new InvalidInputException("Amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive. Provided: " + amount);
        }
    }
    
    public void displayInfo() {
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Account Holder: " + accountHolderName);
        System.out.println("Current Balance: ₱" + getBalance());
        System.out.println("Account Type: " + this.getClass().getSimpleName());
    }
}