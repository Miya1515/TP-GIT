package com.ecommerce.config;

import com.ecommerce.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Pages HTML et assets
                        .requestMatchers("/", "/index.html", "/login.html", "/register.html",
                                "/admin.html", "/css/**", "/js/**", "/error").permitAll()
                        // API publiques
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()
                        // Passer une commande : ouvert aux visiteurs (connectés ou non), le formulaire demande
                        // nom, email, téléphone et adresse
                        .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
                        // Historique des commandes d'un client : utilisateur connecté
                        .requestMatchers(HttpMethod.GET, "/api/orders/customer/**").authenticated()
                        // Opérations d'administration : réservées au rôle ADMIN (JWT, authority ROLE_ADMIN)
                        //  - gestion des commandes (liste, détail, statut, suppression, statistiques)
                        //  - création / modification / suppression des produits et des catégories
                        .requestMatchers("/api/admin/**", "/api/orders/**").hasRole("ADMIN")
                        .requestMatchers("/api/products/**", "/api/categories/**").hasRole("ADMIN")
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}