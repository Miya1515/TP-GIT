package com.ecommerce.dto;


public class RegisterRequest {
    private String nom;
    private String email;
    private String password;

    public String getNom() {
        return this.nom;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setNom(final String nom) {
        this.nom = nom;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof RegisterRequest)) return false;
        final RegisterRequest other = (RegisterRequest) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$nom = this.getNom();
        final Object other$nom = other.getNom();
        if (this$nom == null ? other$nom != null : !this$nom.equals(other$nom)) return false;
        final Object this$email = this.getEmail();
        final Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        final Object this$password = this.getPassword();
        final Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof RegisterRequest;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $nom = this.getNom();
        result = result * PRIME + ($nom == null ? 43 : $nom.hashCode());
        final Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "RegisterRequest(nom=" + this.getNom() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ")";
    }
}
