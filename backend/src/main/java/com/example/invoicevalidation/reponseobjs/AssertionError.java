package com.example.invoicevalidation.reponseobjs;

import lombok.Data;

@Data
public class AssertionError {
    private String id;
    private String test;
    private String description;
    private String severity;

    public AssertionError(String id, String test, String description, String severity) {
        this.id = id;
        this.test = test;
        this.description = description;
        this.severity = severity;
    }

}