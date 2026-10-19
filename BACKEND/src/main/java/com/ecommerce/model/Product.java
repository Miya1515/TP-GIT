package com.ecommerce.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(length = 1000)
    private String description;
    @Column(nullable = false)
    private BigDecimal price;
    @Column(nullable = false)
    private Integer stock;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Product() {
    }

    public Product(final Long id, final String name, final String description, final BigDecimal price, final Integer stock, final String imageUrl, final Category category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    public static ProductBuilder builder() {
        return new ProductBuilder();
    }

    public static class ProductBuilder {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stock;
        private String imageUrl;
        private Category category;

        ProductBuilder() {
        }

        public ProductBuilder id(final Long id) {
            this.id = id;
            return this;
        }

        public ProductBuilder name(final String name) {
            this.name = name;
            return this;
        }

        public ProductBuilder description(final String description) {
            this.description = description;
            return this;
        }

        public ProductBuilder price(final BigDecimal price) {
            this.price = price;
            return this;
        }

        public ProductBuilder stock(final Integer stock) {
            this.stock = stock;
            return this;
        }

        public ProductBuilder imageUrl(final String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductBuilder category(final Category category) {
            this.category = category;
            return this;
        }

        public Product build() {
            return new Product(this.id, this.name, this.description, this.price, this.stock, this.imageUrl, this.category);
        }

        @Override
        public String toString() {
            return "Product.ProductBuilder(id=" + this.id + ", name=" + this.name + ", description=" + this.description + ", price=" + this.price + ", stock=" + this.stock + ", imageUrl=" + this.imageUrl + ", category=" + this.category + ")";
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

    public BigDecimal getPrice() {
        return this.price;
    }

    public Integer getStock() {
        return this.stock;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Category getCategory() {
        return this.category;
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

    public void setPrice(final BigDecimal price) {
        this.price = price;
    }

    public void setStock(final Integer stock) {
        this.stock = stock;
    }

    public void setImageUrl(final String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCategory(final Category category) {
        this.category = category;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Product)) return false;
        final Product other = (Product) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$stock = this.getStock();
        final Object other$stock = other.getStock();
        if (this$stock == null ? other$stock != null : !this$stock.equals(other$stock)) return false;
        final Object this$name = this.getName();
        final Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final Object this$description = this.getDescription();
        final Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        final Object this$price = this.getPrice();
        final Object other$price = other.getPrice();
        if (this$price == null ? other$price != null : !this$price.equals(other$price)) return false;
        final Object this$imageUrl = this.getImageUrl();
        final Object other$imageUrl = other.getImageUrl();
        if (this$imageUrl == null ? other$imageUrl != null : !this$imageUrl.equals(other$imageUrl)) return false;
        final Object this$category = this.getCategory();
        final Object other$category = other.getCategory();
        if (this$category == null ? other$category != null : !this$category.equals(other$category)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Product;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $stock = this.getStock();
        result = result * PRIME + ($stock == null ? 43 : $stock.hashCode());
        final Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        final Object $price = this.getPrice();
        result = result * PRIME + ($price == null ? 43 : $price.hashCode());
        final Object $imageUrl = this.getImageUrl();
        result = result * PRIME + ($imageUrl == null ? 43 : $imageUrl.hashCode());
        final Object $category = this.getCategory();
        result = result * PRIME + ($category == null ? 43 : $category.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Product(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ", price=" + this.getPrice() + ", stock=" + this.getStock() + ", imageUrl=" + this.getImageUrl() + ", category=" + this.getCategory() + ")";
    }
}
