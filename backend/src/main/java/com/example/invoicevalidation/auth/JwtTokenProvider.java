package com.example.invoicevalidation.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

@Component
public class JwtTokenProvider {

    private final List<ActiveToken> activeTokens = new ArrayList<>();
    private final SecretKey signingKey;
    private final int jwtExpiration;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    public JwtTokenProvider(@Value("${app.jwt.expiration}") int jwtExpiration) {
        // Generate a secure key for HS512 algorithm
        this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        this.jwtExpiration = jwtExpiration;
    }

    public List<ActiveToken> getActiveTokens() {
        return this.activeTokens;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        String token = Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();

        activeTokens.add(new ActiveToken(token, expiryDate));
        return token;
    }

    public void removeActiveToken(String token) {
        activeTokens.removeIf(activeToken -> activeToken.getToken().equals(token));
    }

    public boolean tokenExists(String token) {
        boolean found = false;
        for (ActiveToken tokenI : activeTokens) {
            if (tokenI.getToken().equals(token)) {
                found = true;
                break;
            }
        }
        return found;
    }

    public boolean validateToken(String token) {
        invalidateExpiredTokens(); // Invalidate expired tokens before validation
        return activeTokens.stream().anyMatch(activeToken -> activeToken.getToken().equals(token));
    }

    private void invalidateExpiredTokens() {
        Iterator<ActiveToken> iterator = activeTokens.iterator();
        while (iterator.hasNext()) {
            ActiveToken activeToken = iterator.next();
            if (activeToken.getExpiryDate().before(new Date())) {
                iterator.remove(); // Remove expired token
            }
        }
    }

    public User getUserFromToken(String token) {
        try {
            // Parse the JWT token
            Claims claims = Jwts.parser()
                    .setSigningKey(Base64.getEncoder().encodeToString(jwtSecret.getBytes()))
                    .parseClaimsJws(token)
                    .getBody();

            // Extract the user ID from the token
            String userId = claims.getSubject();

            // Fetch the user using the userId from UserRepository
            User user = userRepository.findById(userId).orElse(null);

            return user;
        } catch (Exception e) {
            // Token is invalid or expired
            return null;
        }
    }

    private static class ActiveToken {
        private final String token;
        private final Date expiryDate;

        public ActiveToken(String token, Date expiryDate) {
            this.token = token;
            this.expiryDate = expiryDate;
        }

        public String getToken() {
            return token;
        }

        public Date getExpiryDate() {
            return expiryDate;
        }
    }
}
