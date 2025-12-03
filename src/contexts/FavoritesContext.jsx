import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

// Create the context
const FavoritesContext = createContext()

// API Base URL
const API_URL = '/api'

// Custom hook to use favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}

// Favorites Provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load favorites from PHP API when user changes
  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setFavorites([])
    }
  }, [user])

  // Load favorites from API
  const loadFavorites = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/favorites/list.php?user_id=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add exercise to favorites (PHP API)
  const addToFavorites = async (exercise) => {
    if (!user) {
      throw new Error('You must be logged in to add favorites')
    }

    try {
      const response = await fetch(`${API_URL}/favorites/add.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          body_part: exercise.bodyPart,
          target: exercise.target,
          equipment: exercise.equipment,
          gif_url: exercise.gifUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add to local state
        setFavorites(prev => [...prev, exercise])
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error adding favorite:', error)
      throw error
    }
  }

  // Remove exercise from favorites (PHP API)
  const removeFromFavorites = async (exerciseId) => {
    if (!user) return

    try {
      const response = await fetch(`${API_URL}/favorites/remove.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          exercise_id: exerciseId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== exerciseId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  // Check if exercise is in favorites
  const isFavorite = (exerciseId) => {
    return favorites.some(fav => fav.id === exerciseId)
  }

  // Toggle favorite status
  const toggleFavorite = async (exercise) => {
    if (isFavorite(exercise.id)) {
      await removeFromFavorites(exercise.id)
    } else {
      await addToFavorites(exercise)
    }
  }

  // Clear all favorites
  const clearFavorites = async () => {
    // Remove each favorite one by one
    for (const fav of favorites) {
      await removeFromFavorites(fav.id)
    }
    setFavorites([])
  }

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
    favoritesCount: favorites.length
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesContext