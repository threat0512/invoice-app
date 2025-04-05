package com.example.invoicevalidation.auth;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "log")
@Data
public class EndpointLog {
    @Id
    private String id;
    private String requestMethod;
    private String requestUrl;
    private Date requestTimestamp;

    public EndpointLog(String requestMethod, String requestUrl, Date requestTimestamp) {
        this.requestMethod = requestMethod;
        this.requestUrl = requestUrl;
        this.requestTimestamp = requestTimestamp;
    }
}
