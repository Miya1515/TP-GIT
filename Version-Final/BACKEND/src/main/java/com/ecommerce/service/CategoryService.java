package com.ecommerce.service;
import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    public List<Category> getAllCategories() { return categoryRepository.findAll(); }
    public Optional<Category> getCategoryById(Long id) { return categoryRepository.findById(id); }
    public Category saveCategory(Category category) { return categoryRepository.save(category); }
    public void deleteCategory(Long id) { categoryRepository.deleteById(id); }
    public long count() { return categoryRepository.count(); }
}
