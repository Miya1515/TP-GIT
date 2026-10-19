package com.ecommerce.model;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "order_id", nullable = false) @JsonIgnore
    private Order order;
    @ManyToOne @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = false) private Integer quantity;
    @Column(nullable = false) private BigDecimal unitPrice;

    public OrderItem() {
    }

    public OrderItem(final Long id, final Order order, final Product product, final Integer quantity, final BigDecimal unitPrice) {
        this.id = id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static OrderItemBuilder builder() {
        return new OrderItemBuilder();
    }

    public static class OrderItemBuilder {
        private Long id;
        private Order order;
        private Product product;
        private Integer quantity;
        private BigDecimal unitPrice;

        OrderItemBuilder() {
        }

        public OrderItemBuilder id(final Long id) {
            this.id = id;
            return this;
        }

        public OrderItemBuilder order(final Order order) {
            this.order = order;
            return this;
        }

        public OrderItemBuilder product(final Product product) {
            this.product = product;
            return this;
        }

        public OrderItemBuilder quantity(final Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public OrderItemBuilder unitPrice(final BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
            return this;
        }

        public OrderItem build() {
            return new OrderItem(this.id, this.order, this.product, this.quantity, this.unitPrice);
        }

        @Override
        public String toString() {
            return "OrderItem.OrderItemBuilder(id=" + this.id + ", order=" + this.order + ", product=" + this.product + ", quantity=" + this.quantity + ", unitPrice=" + this.unitPrice + ")";
        }
    }

    public Long getId() {
        return this.id;
    }

    public Order getOrder() {
        return this.order;
    }

    public Product getProduct() {
        return this.product;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public BigDecimal getUnitPrice() {
        return this.unitPrice;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setOrder(final Order order) {
        this.order = order;
    }

    public void setProduct(final Product product) {
        this.product = product;
    }

    public void setQuantity(final Integer quantity) {
        this.quantity = quantity;
    }

    public void setUnitPrice(final BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof OrderItem)) return false;
        final OrderItem other = (OrderItem) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$quantity = this.getQuantity();
        final Object other$quantity = other.getQuantity();
        if (this$quantity == null ? other$quantity != null : !this$quantity.equals(other$quantity)) return false;
        final Object this$order = this.getOrder();
        final Object other$order = other.getOrder();
        if (this$order == null ? other$order != null : !this$order.equals(other$order)) return false;
        final Object this$product = this.getProduct();
        final Object other$product = other.getProduct();
        if (this$product == null ? other$product != null : !this$product.equals(other$product)) return false;
        final Object this$unitPrice = this.getUnitPrice();
        final Object other$unitPrice = other.getUnitPrice();
        if (this$unitPrice == null ? other$unitPrice != null : !this$unitPrice.equals(other$unitPrice)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof OrderItem;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $quantity = this.getQuantity();
        result = result * PRIME + ($quantity == null ? 43 : $quantity.hashCode());
        final Object $order = this.getOrder();
        result = result * PRIME + ($order == null ? 43 : $order.hashCode());
        final Object $product = this.getProduct();
        result = result * PRIME + ($product == null ? 43 : $product.hashCode());
        final Object $unitPrice = this.getUnitPrice();
        result = result * PRIME + ($unitPrice == null ? 43 : $unitPrice.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "OrderItem(id=" + this.getId() + ", order=" + this.getOrder() + ", product=" + this.getProduct() + ", quantity=" + this.getQuantity() + ", unitPrice=" + this.getUnitPrice() + ")";
    }
}
