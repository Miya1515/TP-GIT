package com.ecommerce.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems;

    // ✅ AJOUT : lien avec l'utilisateur connecté (null si commande invité)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public enum OrderStatus { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = OrderStatus.PENDING;
    }

    public Order() {
    }

    public Order(final Long id, final String customerName, final String customerEmail, final String customerPhone, final String shippingAddress, final BigDecimal totalAmount, final OrderStatus status, final LocalDateTime createdAt, final List<OrderItem> orderItems, final User user) {
        this.id = id;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.orderItems = orderItems;
        this.user = user;
    }

    public static OrderBuilder builder() {
        return new OrderBuilder();
    }

    public static class OrderBuilder {
        private Long id;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String shippingAddress;
        private BigDecimal totalAmount;
        private OrderStatus status;
        private LocalDateTime createdAt;
        private List<OrderItem> orderItems;
        private User user;

        OrderBuilder() {
        }

        public OrderBuilder id(final Long id) {
            this.id = id;
            return this;
        }

        public OrderBuilder customerName(final String customerName) {
            this.customerName = customerName;
            return this;
        }

        public OrderBuilder customerEmail(final String customerEmail) {
            this.customerEmail = customerEmail;
            return this;
        }

        public OrderBuilder customerPhone(final String customerPhone) {
            this.customerPhone = customerPhone;
            return this;
        }

        public OrderBuilder shippingAddress(final String shippingAddress) {
            this.shippingAddress = shippingAddress;
            return this;
        }

        public OrderBuilder totalAmount(final BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public OrderBuilder status(final OrderStatus status) {
            this.status = status;
            return this;
        }

        public OrderBuilder createdAt(final LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public OrderBuilder orderItems(final List<OrderItem> orderItems) {
            this.orderItems = orderItems;
            return this;
        }

        public OrderBuilder user(final User user) {
            this.user = user;
            return this;
        }

        public Order build() {
            return new Order(this.id, this.customerName, this.customerEmail, this.customerPhone, this.shippingAddress, this.totalAmount, this.status, this.createdAt, this.orderItems, this.user);
        }

        @Override
        public String toString() {
            return "Order.OrderBuilder(id=" + this.id + ", customerName=" + this.customerName + ", customerEmail=" + this.customerEmail + ", customerPhone=" + this.customerPhone + ", shippingAddress=" + this.shippingAddress + ", totalAmount=" + this.totalAmount + ", status=" + this.status + ", createdAt=" + this.createdAt + ", orderItems=" + this.orderItems + ", user=" + this.user + ")";
        }
    }

    public Long getId() {
        return this.id;
    }

    public String getCustomerName() {
        return this.customerName;
    }

    public String getCustomerEmail() {
        return this.customerEmail;
    }

    public String getCustomerPhone() {
        return this.customerPhone;
    }

    public String getShippingAddress() {
        return this.shippingAddress;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public OrderStatus getStatus() {
        return this.status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public List<OrderItem> getOrderItems() {
        return this.orderItems;
    }

    public User getUser() {
        return this.user;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setCustomerName(final String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerEmail(final String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public void setCustomerPhone(final String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public void setShippingAddress(final String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public void setTotalAmount(final BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(final OrderStatus status) {
        this.status = status;
    }

    public void setCreatedAt(final LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setOrderItems(final List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    @Override
    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Order)) return false;
        final Order other = (Order) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$customerName = this.getCustomerName();
        final Object other$customerName = other.getCustomerName();
        if (this$customerName == null ? other$customerName != null : !this$customerName.equals(other$customerName)) return false;
        final Object this$customerEmail = this.getCustomerEmail();
        final Object other$customerEmail = other.getCustomerEmail();
        if (this$customerEmail == null ? other$customerEmail != null : !this$customerEmail.equals(other$customerEmail)) return false;
        final Object this$customerPhone = this.getCustomerPhone();
        final Object other$customerPhone = other.getCustomerPhone();
        if (this$customerPhone == null ? other$customerPhone != null : !this$customerPhone.equals(other$customerPhone)) return false;
        final Object this$shippingAddress = this.getShippingAddress();
        final Object other$shippingAddress = other.getShippingAddress();
        if (this$shippingAddress == null ? other$shippingAddress != null : !this$shippingAddress.equals(other$shippingAddress)) return false;
        final Object this$totalAmount = this.getTotalAmount();
        final Object other$totalAmount = other.getTotalAmount();
        if (this$totalAmount == null ? other$totalAmount != null : !this$totalAmount.equals(other$totalAmount)) return false;
        final Object this$status = this.getStatus();
        final Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        final Object this$createdAt = this.getCreatedAt();
        final Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final Object this$orderItems = this.getOrderItems();
        final Object other$orderItems = other.getOrderItems();
        if (this$orderItems == null ? other$orderItems != null : !this$orderItems.equals(other$orderItems)) return false;
        final Object this$user = this.getUser();
        final Object other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Order;
    }

    @Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $customerName = this.getCustomerName();
        result = result * PRIME + ($customerName == null ? 43 : $customerName.hashCode());
        final Object $customerEmail = this.getCustomerEmail();
        result = result * PRIME + ($customerEmail == null ? 43 : $customerEmail.hashCode());
        final Object $customerPhone = this.getCustomerPhone();
        result = result * PRIME + ($customerPhone == null ? 43 : $customerPhone.hashCode());
        final Object $shippingAddress = this.getShippingAddress();
        result = result * PRIME + ($shippingAddress == null ? 43 : $shippingAddress.hashCode());
        final Object $totalAmount = this.getTotalAmount();
        result = result * PRIME + ($totalAmount == null ? 43 : $totalAmount.hashCode());
        final Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        final Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final Object $orderItems = this.getOrderItems();
        result = result * PRIME + ($orderItems == null ? 43 : $orderItems.hashCode());
        final Object $user = this.getUser();
        result = result * PRIME + ($user == null ? 43 : $user.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Order(id=" + this.getId() + ", customerName=" + this.getCustomerName() + ", customerEmail=" + this.getCustomerEmail() + ", customerPhone=" + this.getCustomerPhone() + ", shippingAddress=" + this.getShippingAddress() + ", totalAmount=" + this.getTotalAmount() + ", status=" + this.getStatus() + ", createdAt=" + this.getCreatedAt() + ", orderItems=" + this.getOrderItems() + ", user=" + this.getUser() + ")";
    }
}
