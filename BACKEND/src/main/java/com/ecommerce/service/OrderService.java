package com.ecommerce.service;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    public List<Order> getAllOrders() { return orderRepository.findAllByOrderByCreatedAtDesc(); }
    public Optional<Order> getOrderById(Long id) { return orderRepository.findById(id); }
    public List<Order> getOrdersByEmail(String email) { return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(email); }
    @Transactional
    public Order createOrder(Order order, List<Map<String, Object>> cartItems) {
        BigDecimal total = BigDecimal.ZERO;
        for (Map<String, Object> item : cartItems) {
            Long productId = Long.parseLong(item.get("productId").toString());
            int quantity = Integer.parseInt(item.get("quantity").toString());
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Produit introuvable: " + productId));
            if (product.getStock() < quantity)
                throw new RuntimeException("Stock insuffisant pour: " + product.getName());
            OrderItem orderItem = OrderItem.builder()
                    .order(order).product(product).quantity(quantity).unitPrice(product.getPrice()).build();
            order.getOrderItems().add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            product.setStock(product.getStock() - quantity);
            productRepository.save(product);
        }
        order.setTotalAmount(total);
        return orderRepository.save(order);
    }
    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Commande introuvable"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    public void deleteOrder(Long id) { orderRepository.deleteById(id); }
    public long countOrders() { return orderRepository.count(); }
    public BigDecimal getTotalRevenue() {
        return orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
