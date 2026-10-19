package com.ecommerce.controller;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/orders") @CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;
    private final ProductService productService;

    public OrderController(OrderService orderService, ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }
    @GetMapping public List<Order> getAll() { return orderService.getAllOrders(); }
    @GetMapping("/{id}") public ResponseEntity<Order> getOne(@PathVariable Long id) {
        return orderService.getOrderById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/customer/{email}") public List<Order> getByEmail(@PathVariable String email) { return orderService.getOrdersByEmail(email); }
    @PostMapping public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Order order = new Order();
            order.setCustomerName(payload.get("customerName").toString());
            order.setCustomerEmail(payload.get("customerEmail").toString());
            order.setCustomerPhone(payload.get("customerPhone").toString());
            order.setShippingAddress(payload.get("shippingAddress").toString());
            order.setOrderItems(new ArrayList<>());
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) payload.get("cartItems");
            Order saved = orderService.createOrder(order, cartItems);
            return ResponseEntity.ok(saved);
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }
    @PutMapping("/{id}/status") public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.deleteOrder(id); return ResponseEntity.noContent().build();
    }
    @GetMapping("/stats") public Map<String, Object> getStats() {
        return Map.of(
            "totalOrders", orderService.countOrders(),
            "totalProducts", productService.count(),
            "totalRevenue", orderService.getTotalRevenue()
        );
    }
}
