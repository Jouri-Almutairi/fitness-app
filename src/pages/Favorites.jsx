import { Link } from "react-router-dom";
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

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="page-header">
          <h1>⭐ My Favorites</h1>
          <p>Your saved exercises will appear here</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h2>No Favorites Yet</h2>
          <p>Start exploring exercises and save your favorites!</p>
          <Link to="/exercises" className="btn btn-primary">
            Browse Exercises
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>⭐ My Favorites</h1>
        <p>
          You have {favorites.length} saved exercise
          {favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Clear All Button */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to clear all favorites?")
            ) {
              clearFavorites();
            }
          }}
        >
          🗑️ Clear All Favorites
        </button>
      </div>

      {/* Favorites Grid */}
      <div className="exercises-grid">
        {favorites.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <img
              src={fitnessImages[parseInt(exercise.id) % fitnessImages.length]}
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
                <span className="tag tag-equipment">{exercise.equipment}</span>
              </div>
              <div className="exercise-actions">
                <Link
                  to={`/exercise/${exercise.id}`}
                  className="btn btn-primary"
                >
                  Details
                </Link>
                <button
                  className="btn btn-secondary"
                  onClick={() => removeFromFavorites(exercise.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
