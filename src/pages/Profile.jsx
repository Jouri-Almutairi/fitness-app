import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { favoritesCount } = useFavorites();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Get workouts count
  const getWorkoutsCount = () => {
    const workouts = localStorage.getItem(`fitzone_workouts_${user?.id}`);
    return workouts ? JSON.parse(workouts).length : 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await updateProfile(formData.name); // ✅ صح - ترسل string فقط
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ name: user?.name || "" });
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        {success && (
          <div
            style={{
              background: "rgba(78, 205, 196, 0.2)",
              border: "1px solid #4ecdc4",
              color: "#4ecdc4",
              padding: "0.8rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        {/* Profile Info */}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>{user?.name}</h1>
            <p className="email">{user?.email}</p>

            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(true)}
              style={{ marginBottom: "2rem" }}
            >
              ✏️ Edit Profile
            </button>
          </>
        )}

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-box">
            <h3>{favoritesCount}</h3>
            <p>Favorites</p>
          </div>
          <div className="stat-box">
            <h3>{getWorkoutsCount()}</h3>
            <p>Workouts</p>
          </div>
        </div>

        {/* Member Since */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#0a0a0a",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#b0b0b0", margin: 0 }}>
            🗓️ Member since:{" "}
            {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          padding: "2rem",
          borderRadius: "20px",
          marginTop: "2rem",
        }}
      >
        <h2 style={{ color: "#ff6b6b", marginBottom: "1.5rem" }}>
          📊 Account Summary
        </h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem",
              background: "#0a0a0a",
              borderRadius: "10px",
            }}
          >
            <span style={{ color: "#b0b0b0" }}>Email</span>
            <span>{user?.email}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem",
              background: "#0a0a0a",
              borderRadius: "10px",
            }}
          >
            <span style={{ color: "#b0b0b0" }}>Account Status</span>
            <span style={{ color: "#4ecdc4" }}>✓ Active</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem",
              background: "#0a0a0a",
              borderRadius: "10px",
            }}
          >
            <span style={{ color: "#b0b0b0" }}>Plan</span>
            <span style={{ color: "#ffe66d" }}>⭐ Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
