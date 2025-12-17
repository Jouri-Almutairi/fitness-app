import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Create the context
const FavoritesContext = createContext();

// Custom hook to use favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};

// Favorites Provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(
        `fitzone_favorites_${user.id}`
      );
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    if (user) {
      localStorage.setItem(
        `fitzone_favorites_${user.id}`,
        JSON.stringify(newFavorites)
      );
    }
  };

  // Add exercise to favorites
  const addToFavorites = (exercise) => {
    if (!user) {
      throw new Error("You must be logged in to add favorites");
    }

    const isAlreadyFavorite = favorites.some((fav) => fav.id === exercise.id);
    if (isAlreadyFavorite) {
      return; // Already in favorites
    }

    const newFavorites = [...favorites, exercise];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // Remove exercise from favorites
  const removeFromFavorites = (exerciseId) => {
    const newFavorites = favorites.filter((fav) => fav.id !== exerciseId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // Check if exercise is in favorites
  const isFavorite = (exerciseId) => {
    return favorites.some((fav) => fav.id === exerciseId);
  };

  // Toggle favorite status
  const toggleFavorite = (exercise) => {
    if (isFavorite(exercise.id)) {
      removeFromFavorites(exercise.id);
    } else {
      addToFavorites(exercise);
    }
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    if (user) {
      localStorage.removeItem(`fitzone_favorites_${user.id}`);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
