import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";

const fitnessImages = [
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1591258370814-01609b341790?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=300&fit=crop",
];

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Body part categories
  const categories = [
    "all",
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist",
  ];

  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://exercisedb.p.rapidapi.com/exercises?limit=100&offset=0",
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "exercisedb.p.rapidapi.com",
              "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            },
          }
        );
        const data = await response.json();
        setExercises(data);
        setFilteredExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to load exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on search and category
  useEffect(() => {
    let result = exercises;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((ex) => ex.bodyPart === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(search) ||
          ex.target.toLowerCase().includes(search) ||
          ex.equipment.toLowerCase().includes(search) ||
          ex.bodyPart.toLowerCase().includes(search)
      );
    }

    setFilteredExercises(result);
  }, [searchTerm, selectedCategory, exercises]);

  // Handle favorite click
  const handleFavoriteClick = (exercise) => {
    if (!isAuthenticated) {
      alert("Please login to add favorites!");
      return;
    }
    toggleFavorite(exercise);
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="exercises-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>💪 Exercise Library</h1>
        <p>
          Discover {exercises.length}+ exercises to build your perfect workout
        </p>
      </div>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search exercises by name, muscle, or equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p
        style={{ textAlign: "center", marginBottom: "2rem", color: "#b0b0b0" }}
      >
        Showing {filteredExercises.length} exercises
      </p>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <div className="exercises-grid">
          {filteredExercises.map((exercise, index) => (
            <div key={exercise.id} className="exercise-card">
              <img
                src={
                  fitnessImages[parseInt(exercise.id) % fitnessImages.length]
                }
                alt={exercise.name}
                className="exercise-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = fitnessImages[0];
                }}
              />
              <div className="exercise-info">
                <h3>{exercise.name}</h3>
                <div className="exercise-tags">
                  <span className="tag tag-body">{exercise.bodyPart}</span>
                  <span className="tag tag-target">{exercise.target}</span>
                  <span className="tag tag-equipment">
                    {exercise.equipment}
                  </span>
                </div>
                <div className="exercise-actions">
                  <Link
                    to={`/exercise/${exercise.id}`}
                    className="btn btn-primary"
                  >
                    Details
                  </Link>
                  <button
                    className={`btn ${
                      isFavorite(exercise.id) ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => handleFavoriteClick(exercise)}
                  >
                    {isFavorite(exercise.id) ? "⭐" : "☆"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2>No exercises found</h2>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Exercises;
