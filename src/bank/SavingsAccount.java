package bank;

import bank.exceptions.InvalidInputException;
import bank.exceptions.InsufficientFundsException;
import java.math.BigDecimal;
import java.math.RoundingMode;

public class SavingsAccount extends Account implements InterestBearing {
    
    private static final BigDecimal MINIMUM_BALANCE = new BigDecimal("500.00");
    private static final double INTEREST_RATE = 0.04;
    private int withdrawalCount;
    private static final int FREE_WITHDRAWALS = 3;
    private static final BigDecimal WITHDRAWAL_FEE = new BigDecimal("10.00");
    
    public SavingsAccount(String accountNumber, String accountHolderName, BigDecimal initialBalance) {
        super(accountNumber, accountHolderName, initialBalance);
        this.withdrawalCount = 0;
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
        
        BigDecimal tempBalance = balance.subtract(amount);
        if (tempBalance.compareTo(MINIMUM_BALANCE) < 0) {
            throw new InsufficientFundsException(
                "Cannot withdraw. Minimum balance of ₱" + MINIMUM_BALANCE + " required",
                balance.doubleValue(),
                amount.doubleValue()
            );
        }
        
        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException(
                "Insufficient funds for withdrawal",
                balance.doubleValue(),
                amount.doubleValue()
            );
        }
        
        balance = balance.subtract(amount);
        withdrawalCount++;
        
        if (withdrawalCount > FREE_WITHDRAWALS) {
            balance = balance.subtract(WITHDRAWAL_FEE);
            System.out.println("Withdrawal fee of ₱" + WITHDRAWAL_FEE + " applied.");
        }
        
        System.out.printf("Withdrew: ₱%.2f | New Balance: ₱%.2f%n", amount, balance);
    }
    
    @Override
    public BigDecimal calculateInterest() {
        BigDecimal interest = balance.multiply(BigDecimal.valueOf(INTEREST_RATE));
        return interest.setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public void applyInterest() {
        BigDecimal interest = calculateInterest();
        balance = balance.add(interest);
        System.out.printf("Interest of ₱%.2f applied at %.1f%% rate.%n", interest, INTEREST_RATE * 100);
    }
    
    @Override
    public double getInterestRate() {
        return INTEREST_RATE;
    }
    
    public int getWithdrawalCount() {
        return withdrawalCount;
    }
    
    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Interest Rate: " + (INTEREST_RATE * 100) + "%");
        System.out.println("Minimum Balance: ₱" + MINIMUM_BALANCE);
        System.out.println("Withdrawals this month: " + withdrawalCount + "/" + FREE_WITHDRAWALS + " free");
    }
}