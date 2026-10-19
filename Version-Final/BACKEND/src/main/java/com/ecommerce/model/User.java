package com.ecommerce.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public enum Role { CLIENT, ADMIN }

    public User() {
    }

    public User(final Long id, final String nom, final String email, final String password, final Role role) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String nom;
        private String email;
        private String password;
        private Role role;

        UserBuilder() {
        }

        public UserBuilder id(final Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder nom(final String nom) {
            this.nom = nom;
            return this;
        }

        public UserBuilder email(final String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(final String password) {
            this.password = password;
            return this;
        }

        public UserBuilder role(final Role role) {
            this.role = role;
            return this;
        }

        public User build() {
            return new User(this.id, this.nom, this.email, this.password, this.role);
        }

        @Override
        public String toString() {
            return "User.UserBuilder(id=" + this.id + ", nom=" + this.nom + ", email=" + this.email + ", password=" + this.password + ", role=" + this.role + ")";
        }
    }

    public Long getId() {
        return this.id;
    }

    public String getNom() {
        return this.nom;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public Role getRole() {
        return this.role;
    }

    public void setId(final Long id) {
        this.id = id;
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

    public void setRole(final Role role) {
        this.role = role;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof User)) return false;
        final User other = (User) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$nom = this.getNom();
        final Object other$nom = other.getNom();
        if (this$nom == null ? other$nom != null : !this$nom.equals(other$nom)) return false;
        final Object this$email = this.getEmail();
        final Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        final Object this$password = this.getPassword();
        final Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        final Object this$role = this.getRole();
        final Object other$role = other.getRole();
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof User;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $nom = this.getNom();
        result = result * PRIME + ($nom == null ? 43 : $nom.hashCode());
        final Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        final Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        final Object $role = this.getRole();
        result = result * PRIME + ($role == null ? 43 : $role.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "User(id=" + this.getId() + ", nom=" + this.getNom() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ", role=" + this.getRole() + ")";
    }
}
