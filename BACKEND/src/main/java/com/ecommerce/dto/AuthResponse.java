package com.ecommerce.dto;


public class AuthResponse {
    private String token;
    private String role;
    private String nom;
    private String email;

    public AuthResponse(final String token, final String role, final String nom, final String email) {
        this.token = token;
        this.role = role;
        this.nom = nom;
        this.email = email;
    }

    public String getToken() {
        return this.token;
    }

    public String getRole() {
        return this.role;
    }

    public String getNom() {
        return this.nom;
    }

    public String getEmail() {
        return this.email;
    }

    public void setToken(final String token) {
        this.token = token;
    }

    public void setRole(final String role) {
        this.role = role;
    }

    public void setNom(final String nom) {
        this.nom = nom;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof AuthResponse)) return false;
        final AuthResponse other = (AuthResponse) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$token = this.getToken();
        final Object other$token = other.getToken();
        if (this$token == null ? other$token != null : !this$token.equals(other$token)) return false;
        final Object this$role = this.getRole();
        final Object other$role = other.getRole();
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) return false;
        final Object this$nom = this.getNom();
        final Object other$nom = other.getNom();
        if (this$nom == null ? other$nom != null : !this$nom.equals(other$nom)) return false;
        final Object this$email = this.getEmail();
        final Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof AuthResponse;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $token = this.getToken();
        result = result * PRIME + ($token == null ? 43 : $token.hashCode());
        final Object $role = this.getRole();
        result = result * PRIME + ($role == null ? 43 : $role.hashCode());
        final Object $nom = this.getNom();
        result = result * PRIME + ($nom == null ? 43 : $nom.hashCode());
        final Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AuthResponse(token=" + this.getToken() + ", role=" + this.getRole() + ", nom=" + this.getNom() + ", email=" + this.getEmail() + ")";
    }
}
