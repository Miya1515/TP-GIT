package com.ecommerce.controller;
import com.ecommerce.model.Category;
import com.ecommerce.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/categories") @CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    @GetMapping public List<Category> getAll() { return categoryService.getAllCategories(); }
    @GetMapping("/{id}") public ResponseEntity<Category> getOne(@PathVariable Long id) {
        return categoryService.getCategoryById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Category> create(@RequestBody Category c) { return ResponseEntity.ok(categoryService.saveCategory(c)); }
    @PutMapping("/{id}") public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category c) {
        c.setId(id); return ResponseEntity.ok(categoryService.saveCategory(c));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id); return ResponseEntity.noContent().build();
    }
}
