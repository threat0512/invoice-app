package com.example.invoicevalidation.reponseobjs;

import lombok.Data;
import java.util.*;;

@Data
public class PeppolUBLRuleResponse {
    private boolean successful = false;
    private String reason;
    private FiredAssertionErrors firedAssertionErrors;

    public PeppolUBLRuleResponse(boolean successful, String reason, FiredAssertionErrors firedAssertionErrors) {
        this.successful = successful;
        this.reason = reason;
        this.firedAssertionErrors = firedAssertionErrors;
    }

}