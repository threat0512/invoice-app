package com.example.invoicevalidation.auth;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.invoicevalidation.auth.requestobjects.ChangePasswordRequest;
import com.example.invoicevalidation.auth.requestobjects.UserRequest;

import at.favre.lib.crypto.bcrypt.BCrypt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
public class AuthRoutes {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    LogRepository logRepository;

    // Password Encryption
    public static String encryptPassword(String password) {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray());
    }

    public static boolean verifyPassword(String password, String hash) {
        BCrypt.Result r = BCrypt.verifyer().verify(password.toCharArray(), hash);
        return r.verified;
    }

    @PostMapping(value = "/auth/register")
    public ResponseEntity <?> registerUser(@RequestBody UserRequest entity) {
        logRepository.save(new EndpointLog("POST", "/auth/register", new Date()));

        if (userRepository.findByUsername(entity.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        User user = new User(entity.getUsername(), encryptPassword(entity.getPassword()));
        String token = jwtTokenProvider.generateToken(user);
        user.setToken(token);
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.OK)
                .body("Your account with username \"" + entity.getUsername() + "\" has been created. Your token is: \""
                        +
                        user.getToken() + "\"");
    }

    @PostMapping("/auth/login")
    public ResponseEntity <String> loginUser(@RequestBody UserRequest loginUser) {
        logRepository.save(new EndpointLog("POST", "/auth/login", new Date()));

        User user = userRepository.findByUsername(loginUser.getUsername());

        // Check if the user exists and the password matches
        if (user == null || !verifyPassword(loginUser.getPassword(), user.getPasswordEncrypted())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        if (jwtTokenProvider.tokenExists(user.getToken())) {
            System.out.println("user already logged in");
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Successful login, your token is: \"" +
                            user.getToken() + "\"");
        }

        String token = jwtTokenProvider.generateToken(user);
        user.setToken(token);
        userRepository.save(user);

        System.out.println("login");
        System.out.println(jwtTokenProvider.getActiveTokens());

        return ResponseEntity.status(HttpStatus.OK)
                .body("Successful login, your token is: \"" +
                        user.getToken() + "\"");
    }

    @DeleteMapping("/auth/logout")
    public ResponseEntity <?> logoutUser(@RequestHeader("Authorization") String token) {
        logRepository.save(new EndpointLog("POST", "/auth/logout", new Date()));

        System.out.println("logout");
        jwtTokenProvider.removeActiveToken(token); // Remove token from the list of active tokens

        System.out.println(jwtTokenProvider.getActiveTokens());
        return ResponseEntity.ok("Logout successful");
    }

    @PutMapping("/auth/change-password/v2")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token,
            @RequestBody ChangePasswordRequest changePasswordRequest) {
        // Get the user associated with the token
        User user = jwtTokenProvider.getUserFromToken(token);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }

        // Verify if the old password matches the user's current password
        if (!verifyPassword(changePasswordRequest.getOldPassword(), user.getPasswordEncrypted())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Old password cannot be the same as new password");
        }

        // Encrypt and update the password
        user.setPasswordEncrypted(encryptPassword(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }
}