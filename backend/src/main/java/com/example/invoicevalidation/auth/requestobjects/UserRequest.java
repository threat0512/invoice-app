package com.example.invoicevalidation.auth.requestobjects;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;

    public UserRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

}