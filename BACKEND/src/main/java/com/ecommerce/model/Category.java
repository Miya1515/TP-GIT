package com.ecommerce.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)   // ← هنا ربطنا name مع nom
    private String name;

    private String description;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Product> products;

    public Category() {
    }

    public Category(final Long id, final String name, final String description, final List<Product> products) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.products = products;
    }

    public static CategoryBuilder builder() {
        return new CategoryBuilder();
    }

    public static class CategoryBuilder {
        private Long id;
        private String name;
        private String description;
        private List<Product> products;

        CategoryBuilder() {
        }

        public CategoryBuilder id(final Long id) {
            this.id = id;
            return this;
        }

        public CategoryBuilder name(final String name) {
            this.name = name;
            return this;
        }

        public CategoryBuilder description(final String description) {
            this.description = description;
            return this;
        }

        public CategoryBuilder products(final List<Product> products) {
            this.products = products;
            return this;
        }

        public Category build() {
            return new Category(this.id, this.name, this.description, this.products);
        }

        @Override
        public String toString() {
            return "Category.CategoryBuilder(id=" + this.id + ", name=" + this.name + ", description=" + this.description + ", products=" + this.products + ")";
        }
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public List<Product> getProducts() {
        return this.products;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public void setProducts(final List<Product> products) {
        this.products = products;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Category)) return false;
        final Category other = (Category) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$name = this.getName();
        final Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final Object this$description = this.getDescription();
        final Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        final Object this$products = this.getProducts();
        final Object other$products = other.getProducts();
        if (this$products == null ? other$products != null : !this$products.equals(other$products)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Category;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        final Object $products = this.getProducts();
        result = result * PRIME + ($products == null ? 43 : $products.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Category(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ", products=" + this.getProducts() + ")";
    }
}
