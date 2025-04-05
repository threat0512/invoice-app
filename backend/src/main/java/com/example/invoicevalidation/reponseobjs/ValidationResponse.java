package com.example.invoicevalidation.reponseobjs;

import lombok.Data;

@Data
public class ValidationResponse {
    boolean successful;
    String reason;
    String details;

    public ValidationResponse(boolean successful, String reason, String details) {
        this.successful = successful;
        this.reason = reason;
        this.details = details;
    }

}