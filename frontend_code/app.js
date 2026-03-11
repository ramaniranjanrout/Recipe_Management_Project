document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const userProfile = {
        fullName: document.getElementById("userName").value,
        cookingSkill: document.getElementById("userSkill").value,
        dietPreference: document.getElementById("userDiet").value,
        allergies: document.getElementById("userAllergies").value,
        favoriteIngredients: document.getElementById("favIngredients").value
    };

    console.log("Saving user profile...", userProfile);

    try {
        const response = await fetch("http://localhost:8081/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userProfile)
        });

        if (response.ok) {
            alert("Your profile is saved successfully");
            localStorage.setItem("currentUserName", userProfile.fullName);
            document.getElementById("userForm").reset();
        } else {
            alert("Error saving profile. Is Spring Boot running?");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Cannot connect to server. Please check if Spring Boot backend is on.");
    }
});
document.getElementById("searchBtn").addEventListener("click", async function() {
    const query = document.getElementById("searchInput").value;
    const filter = document.getElementById("categoryFilter").value;
    const container = document.getElementById("recipeContainer");

    if (query === "" && filter === "") {
        alert("Please enter a recipe name or select a filter");
        return;
    }
    container.innerHTML = "<p>Searching for delicious recipes...</p>";
    let apiUrl = query !== "" 
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}` 
        : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filter}`;

    try {
        let data;
                const cachedData = sessionStorage.getItem(apiUrl);
        if (cachedData) {
            console.log("Loading from Cache! (API calls reduced)");
            data = JSON.parse(cachedData);
        } else {
            console.log("Fetching fresh data from API...");
            const response = await fetch(apiUrl);
            data = await response.json();
            sessionStorage.setItem(apiUrl, JSON.stringify(data));
        }
        container.innerHTML = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                const card = document.createElement("div");
                card.className = "recipe-card";
                card.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button onclick="openModal('${meal.idMeal}', '${meal.strMeal}')" style="margin-bottom: 10px;">Rate & Review</button>
                    <div id="reviews-${meal.idMeal}" style="text-align: left; font-size: 14px; background: #eee; padding: 10px; border-radius: 5px;">
                        <small>Loading reviews...</small>
                    </div>
                `;
                container.appendChild(card);
                fetchReviewsFromDatabase(meal.idMeal);
            });
        } else {
            container.innerHTML = "<p>No recipes found. Try another search.</p>";
        }
    } catch (error) {
        console.error("API Error:", error);
        container.innerHTML = "<p>Error fetching recipes.</p>";
    }
});

async function fetchReviewsFromDatabase(recipeId) {
    const reviewDiv = document.getElementById(`reviews-${recipeId}`);
    try {
        const response = await fetch(`http://localhost:8081/api/reviews/${recipeId}`);
        if(response.ok) {
            const reviews = await response.json();
            
            if(reviews.length > 0) {
                let totalRating = 0;
                let reviewHtml = `<strong>User Reviews:</strong><ul style="padding-left: 20px; margin-top: 5px;">`;
                
                reviews.forEach(r => {
                    totalRating += r.rating;
                    reviewHtml += `<li><b>${r.reviewerName}</b> (${r.rating}/5): ${r.comments}</li>`;
                });
                
                let avg = (totalRating / reviews.length).toFixed(1);
                reviewDiv.innerHTML = `<p style="color: #ff6347; margin-bottom: 5px;"><b>Average Rating: ${avg} / 5</b></p>` + reviewHtml + `</ul>`;
            } else {
                reviewDiv.innerHTML = "<i>No reviews yet. Be the first to review!</i>";
            }
        }
    } catch(e) {
        reviewDiv.innerHTML = "<small style='color:red;'>Cannot load reviews from server.</small>";
    }
}

const modal = document.getElementById("reviewModal");

window.openModal = function(id, name) {
    document.getElementById("currentRecipeId").value = id;
    document.getElementById("recipeNameDisplay").innerText = "Reviewing: " + name;
    modal.style.display = "block";
};
document.getElementById("closeModal").addEventListener("click", function() {
    modal.style.display = "none";
});

document.getElementById("submitReviewBtn").addEventListener("click", async function() {
    const rating = document.getElementById("ratingInput").value;
    const comments = document.getElementById("commentInput").value;
    const recipeId = document.getElementById("currentRecipeId").value;    
    const reviewerName = localStorage.getItem("currentUserName") || "Anonymous User";

    if (rating === "" || comments === "") {
        alert("Please enter your rating (1-5) and comments.");
        return;
    }
    const reviewData = {
        recipeId: recipeId,
        reviewerName: reviewerName,
        rating: parseInt(rating),
        comments: comments
    };

    console.log("Sending review to database...", reviewData);

    try {
        const response = await fetch("http://localhost:8081/api/add-review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            alert("Awesome! Review saved successfully!");
            modal.style.display = "none"; 
            document.getElementById("ratingInput").value = "";
            document.getElementById("commentInput").value = "";
        } else {
            alert("Error saving review");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Cannot connect to server.");
    }
});