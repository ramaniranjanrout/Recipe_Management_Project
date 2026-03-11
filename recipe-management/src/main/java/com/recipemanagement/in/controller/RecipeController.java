package com.recipemanagement.in.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.recipemanagement.in.entity.*;
import com.recipemanagement.in.repository.*;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RecipeController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        userRepository.save(user);
        return "User profile saved successfully in database";
    }
    @PostMapping("/add-review")
    public String addReview(@RequestBody Review review) {
        reviewRepository.save(review);
        return "Review saved successfully in database";
    }
    @GetMapping("/reviews/{recipeId}")
    public List<Review> getRecipeReviews(@PathVariable String recipeId) {
        return reviewRepository.findByRecipeId(recipeId);
    }
}