package com.ecommerce.controller;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }
        User user = User.builder()
                .nom(req.getNom())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.CLIENT)
                .build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getNom(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.getEmail())
                .filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
                .map(u -> {
                    String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
                    return ResponseEntity.ok(new AuthResponse(token, u.getRole().name(), u.getNom(), u.getEmail()));
                })
                .orElse(ResponseEntity.status(401).build());
    }
}