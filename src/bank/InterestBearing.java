package bank;

import java.math.BigDecimal;

public interface InterestBearing {
    
    double DEFAULT_INTEREST_RATE = 0.03;
    
    BigDecimal calculateInterest();
    
    void applyInterest();
    
    double getInterestRate();
}