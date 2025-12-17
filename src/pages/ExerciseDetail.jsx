import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Fetch exercise details from API
  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "exercisedb.p.rapidapi.com",
              "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            },
          }
        );
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setError("Failed to load exercise details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  // Handle favorite click
  const handleFavoriteClick = () => {
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

  // Not found state
  if (!exercise) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h2>Exercise not found</h2>
        <p>The exercise you're looking for doesn't exist</p>
        <Link to="/exercises" className="btn btn-primary">
          Back to Exercises
        </Link>
      </div>
    );
  }

  return (
    <div className="exercise-detail">
      {/* Back Button */}
      <Link
        to="/exercises"
        style={{
          color: "#ff6b6b",
          marginBottom: "2rem",
          display: "inline-block",
        }}
      >
        ← Back to Exercises
      </Link>

      {/* Detail Header */}
      <div className="detail-header">
        <img
          src={fitnessImages[parseInt(exercise.id) % fitnessImages.length]}
          alt={exercise.name}
          className="exercise-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = fitnessImages[0];
          }}
        />
        <div className="detail-info">
          <h1>{exercise.name}</h1>

          <div className="detail-tags">
            <span className="tag tag-body">{exercise.bodyPart}</span>
            <span className="tag tag-target">{exercise.target}</span>
            <span className="tag tag-equipment">{exercise.equipment}</span>
          </div>

          {/* Stats */}
          <div className="profile-stats" style={{ marginTop: "1.5rem" }}>
            <div className="stat-box">
              <h3>🎯</h3>
              <p>Target: {exercise.target}</p>
            </div>
            <div className="stat-box">
              <h3>🏋️</h3>
              <p>Equipment: {exercise.equipment}</p>
            </div>
          </div>

          {/* Secondary Muscles */}
          {exercise.secondaryMuscles &&
            exercise.secondaryMuscles.length > 0 && (
              <>
                <h2>Secondary Muscles</h2>
                <div className="detail-tags">
                  {exercise.secondaryMuscles.map((muscle, index) => (
                    <span key={index} className="tag tag-target">
                      {muscle}
                    </span>
                  ))}
                </div>
              </>
            )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button
              className={`btn ${
                isFavorite(exercise.id) ? "btn-primary" : "btn-secondary"
              }`}
              onClick={handleFavoriteClick}
            >
              {isFavorite(exercise.id)
                ? "⭐ Saved to Favorites"
                : "☆ Add to Favorites"}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#ff6b6b", marginBottom: "1rem" }}>
            📝 Instructions
          </h2>
          <ol className="instructions-list">
            {exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Tips Section */}
      <div
        style={{
          marginTop: "3rem",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          padding: "2rem",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "#ff6b6b", marginBottom: "1rem" }}>💡 Pro Tips</h2>
        <ul style={{ color: "#b0b0b0", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            Always warm up before performing this exercise
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Focus on proper form rather than heavy weights
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Control the movement in both directions
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Breathe steadily throughout the exercise
          </li>
          <li>Rest 60-90 seconds between sets</li>
        </ul>
      </div>
    </div>
  );
};

export default ExerciseDetail;
