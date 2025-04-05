package com.example.invoicevalidation.auth.requestobjects;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
