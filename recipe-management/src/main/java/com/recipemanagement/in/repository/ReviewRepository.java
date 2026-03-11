package com.recipemanagement.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.recipemanagement.in.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
    List<Review> findByRecipeId(String recipeId);
}
