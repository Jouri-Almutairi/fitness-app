import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { favoritesCount } = useFavorites();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          💪 FitZone
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/exercises">Exercises</Link>
          {isAuthenticated && (
            <Link to="/favorites">
              Favorites {favoritesCount > 0 && `(${favoritesCount})`}
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤 {user.name.split(" ")[0]}
              </button>

              {showDropdown && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    👤 Profile
                  </Link>
                  <Link to="/favorites" onClick={() => setShowDropdown(false)}>
                    ⭐ My Favorites
                  </Link>
                  <Link
                    to="/workout-plan"
                    onClick={() => setShowDropdown(false)}
                  >
                    📋 Workout Plan
                  </Link>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
