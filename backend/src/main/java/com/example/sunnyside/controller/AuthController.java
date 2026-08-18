package com.example.sunnyside.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sunnyside.util.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @org.springframework.beans.factory.annotation.Value("${ADMIN_USERNAME:admin}")
    private String ADMIN_USERNAME;

    @org.springframework.beans.factory.annotation.Value("${ADMIN_PASSWORD:}")
    private String ADMIN_PASSWORD;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (ADMIN_PASSWORD == null || ADMIN_PASSWORD.isEmpty()) {
            // Require an admin password to be set via environment variable for production safety
            return ResponseEntity.status(503).body(new ErrorResponse("Admin password not configured. Set ADMIN_PASSWORD environment variable."));
        }
        if (ADMIN_USERNAME.equals(loginRequest.getUsername()) && 
            ADMIN_PASSWORD.equals(loginRequest.getPassword())) {
            String token = jwtTokenProvider.generateToken(loginRequest.getUsername());
            return ResponseEntity.ok(new LoginResponse(token, loginRequest.getUsername()));
        }
        return ResponseEntity.status(401).body(new ErrorResponse("Invalid credentials"));
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Missing or invalid authorization header"));
        }
        
        String token = authHeader.substring(7);
        if (jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsernameFromToken(token);
            return ResponseEntity.ok(new ValidationResponse(true, username));
        }
        return ResponseEntity.status(401).body(new ErrorResponse("Invalid token"));
    }
    
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() { return username; }
        public String getPassword() { return password; }
        public void setUsername(String username) { this.username = username; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class LoginResponse {
        private String token;
        private String username;
        
        public LoginResponse(String token, String username) {
            this.token = token;
            this.username = username;
        }
        
        public String getToken() { return token; }
        public String getUsername() { return username; }
    }
    
    public static class ValidationResponse {
        private boolean valid;
        private String username;
        
        public ValidationResponse(boolean valid, String username) {
            this.valid = valid;
            this.username = username;
        }
        
        public boolean isValid() { return valid; }
        public String getUsername() { return username; }
    }
    
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
