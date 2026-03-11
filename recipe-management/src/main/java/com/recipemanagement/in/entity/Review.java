package com.recipemanagement.in.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "recipe_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipeId;
    private String reviewerName;
    private int rating;
    private String comments;

    
}
