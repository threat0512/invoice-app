package com.example.invoicevalidation.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "user")
@Data
public class User {
    @Id
    private String id;
    private String username;
    private String passwordEncrypted;
    private String token;

    public User(String username, String passwordEncrypted) {
        super();
        this.username = username;
        this.passwordEncrypted = passwordEncrypted;
    }
}