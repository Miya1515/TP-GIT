package com.ecommerce.controller;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.service.CategoryService;
import com.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/products") @CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;
    private final CategoryService categoryService;

    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }
    @GetMapping public List<Product> getAll() { return productService.getAllProducts(); }
    @GetMapping("/{id}") public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productService.getProductById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/category/{categoryId}") public List<Product> getByCategory(@PathVariable Long categoryId) { return productService.getProductsByCategory(categoryId); }
    @GetMapping("/search") public List<Product> search(@RequestParam String keyword) { return productService.searchProducts(keyword); }
    @PostMapping public ResponseEntity<Product> create(@RequestBody Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category cat = categoryService.getCategoryById(product.getCategory().getId()).orElse(null);
            product.setCategory(cat);
        }
        return ResponseEntity.ok(productService.saveProduct(product));
    }
    @PutMapping("/{id}") public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        if (!productService.existsById(id)) return ResponseEntity.notFound().build();
        product.setId(id);
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category cat = categoryService.getCategoryById(product.getCategory().getId()).orElse(null);
            product.setCategory(cat);
        }
        return ResponseEntity.ok(productService.saveProduct(product));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productService.existsById(id)) return ResponseEntity.notFound().build();
        productService.deleteProduct(id); return ResponseEntity.noContent().build();
    }
}
