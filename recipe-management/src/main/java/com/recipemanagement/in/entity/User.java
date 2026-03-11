package com.recipemanagement.in.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "user_profiles")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String cookingSkill;
    private String dietPreference;
    private String allergies;
    private String favoriteIngredients;
}
