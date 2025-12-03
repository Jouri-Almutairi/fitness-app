import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()

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
    )
  }

  return (
    <div className="favorites-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>⭐ My Favorites</h1>
        <p>You have {favorites.length} saved exercise{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Clear All Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all favorites?')) {
              clearFavorites()
            }
          }}
        >
          🗑️ Clear All Favorites
        </button>
      </div>

      {/* Favorites Grid */}
      <div className="exercises-grid">
        {favorites.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="exercise-image"
              loading="lazy"
            />
            <div className="exercise-info">
              <h3>{exercise.name}</h3>
              <div className="exercise-tags">
                <span className="tag tag-body">{exercise.bodyPart}</span>
                <span className="tag tag-target">{exercise.target}</span>
                <span className="tag tag-equipment">{exercise.equipment}</span>
              </div>
              <div className="exercise-actions">
                <Link to={`/exercise/${exercise.id}`} className="btn btn-primary">
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
  )
}

export default Favorites