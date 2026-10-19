package com.ecommerce.service;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    public List<Product> getAllProducts() { return productRepository.findAll(); }
    public Optional<Product> getProductById(Long id) { return productRepository.findById(id); }
    public List<Product> getProductsByCategory(Long categoryId) { return productRepository.findByCategoryId(categoryId); }
    public List<Product> searchProducts(String keyword) { return productRepository.findByNameContainingIgnoreCase(keyword); }
    public Product saveProduct(Product product) { return productRepository.save(product); }
    public void deleteProduct(Long id) { productRepository.deleteById(id); }
    public boolean existsById(Long id) { return productRepository.existsById(id); }
    public long count() { return productRepository.count(); }
}
