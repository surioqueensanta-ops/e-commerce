package bank.exceptions;

public class InsufficientFundsException extends Exception {
    
    private double availableBalance;
    private double requestedAmount;
    
    public InsufficientFundsException(String message) {
        super(message);
    }
    
    public InsufficientFundsException(String message, double available, double requested) {
        super(message);
        this.availableBalance = available;
        this.requestedAmount = requested;
    }
    
    public double getAvailableBalance() {
        return availableBalance;
    }
    
    public double getRequestedAmount() {
        return requestedAmount;
    }
}