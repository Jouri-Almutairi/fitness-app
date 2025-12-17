import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";

const WorkoutPlan = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    days: [],
    exercises: [],
  });

  // Days of the week
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Load workouts from localStorage
  useEffect(() => {
    if (user) {
      const savedWorkouts = localStorage.getItem(`fitzone_workouts_${user.id}`);
      if (savedWorkouts) {
        setWorkouts(JSON.parse(savedWorkouts));
      }
    }
  }, [user]);

  // Save workouts to localStorage
  const saveWorkouts = (newWorkouts) => {
    localStorage.setItem(
      `fitzone_workouts_${user.id}`,
      JSON.stringify(newWorkouts)
    );
    setWorkouts(newWorkouts);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter a workout name");
      return;
    }
    if (formData.days.length === 0) {
      alert("Please select at least one day");
      return;
    }

    if (editingWorkout) {
      // Update existing workout
      const updatedWorkouts = workouts.map((w) =>
        w.id === editingWorkout.id
          ? {
              ...w,
              name: formData.name,
              days: formData.days,
              exercises: formData.exercises,
            }
          : w
      );
      saveWorkouts(updatedWorkouts);
      setEditingWorkout(null);
    } else {
      // Create new workout
      const newWorkout = {
        id: Date.now().toString(),
        name: formData.name,
        days: formData.days,
        exercises: formData.exercises,
        createdAt: new Date().toISOString(),
      };
      saveWorkouts([...workouts, newWorkout]);
    }

    setFormData({ name: "", days: [], exercises: [] });
    setShowForm(false);
  };

  // Edit workout
  const editWorkout = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      days: workout.days || [workout.day],
      exercises: workout.exercises,
    });
    setShowForm(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingWorkout(null);
    setFormData({ name: "", days: [], exercises: [] });
    setShowForm(false);
  };

  // Delete workout
  const deleteWorkout = (workoutId) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const newWorkouts = workouts.filter((w) => w.id !== workoutId);
      saveWorkouts(newWorkouts);
    }
  };

  // Toggle day in form
  const toggleDay = (day) => {
    const isSelected = formData.days.includes(day);
    if (isSelected) {
      setFormData((prev) => ({
        ...prev,
        days: prev.days.filter((d) => d !== day),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        days: [...prev.days, day],
      }));
    }
  };

  // Toggle exercise in form
  const toggleExercise = (exercise) => {
    const isSelected = formData.exercises.some((ex) => ex.id === exercise.id);
    if (isSelected) {
      setFormData((prev) => ({
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== exercise.id),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        exercises: [...prev.exercises, exercise],
      }));
    }
  };

  return (
    <div className="workout-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>📋 My Workout Plan</h1>
        <p>Create and manage your weekly workout routine</p>
      </div>

      {/* Add Workout Button */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              cancelEdit();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✕ Cancel" : "+ Create New Workout"}
        </button>
      </div>

      {/* Create/Edit Workout Form */}
      {showForm && (
        <div className="workout-form">
          <h2 style={{ marginBottom: "1.5rem", color: "#ff6b6b" }}>
            {editingWorkout ? "Edit Workout" : "Create New Workout"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Workout Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Chest Day, Leg Day..."
              />
            </div>

            {/* Select Days */}
            <div className="form-group">
              <label>Select Days</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {days.map((day) => (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: "0.8rem 1.2rem",
                      background: formData.days.includes(day)
                        ? "rgba(255, 107, 107, 0.3)"
                        : "#0a0a0a",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border: formData.days.includes(day)
                        ? "2px solid #ff6b6b"
                        : "2px solid #2a2a4a",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {formData.days.includes(day) ? "✓ " : ""}
                    {day}
                  </div>
                ))}
              </div>
              <p
                style={{
                  color: "#b0b0b0",
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Selected: {formData.days.length} day(s)
              </p>
            </div>

            {/* Select from Favorites */}
            <div className="form-group">
              <label>Select Exercises from Favorites</label>
              {favorites.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {favorites.map((exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => toggleExercise(exercise)}
                      style={{
                        padding: "0.8rem",
                        background: formData.exercises.some(
                          (ex) => ex.id === exercise.id
                        )
                          ? "rgba(255, 107, 107, 0.3)"
                          : "#0a0a0a",
                        borderRadius: "10px",
                        cursor: "pointer",
                        border: formData.exercises.some(
                          (ex) => ex.id === exercise.id
                        )
                          ? "2px solid #ff6b6b"
                          : "2px solid #2a2a4a",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.9rem",
                          textTransform: "capitalize",
                          margin: 0,
                        }}
                      >
                        {formData.exercises.some((ex) => ex.id === exercise.id)
                          ? "✓ "
                          : ""}
                        {exercise.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#b0b0b0", marginTop: "0.5rem" }}>
                  No favorites yet.{" "}
                  <Link to="/exercises" style={{ color: "#ff6b6b" }}>
                    Add some exercises to favorites first!
                  </Link>
                </p>
              )}
            </div>

            <p style={{ color: "#b0b0b0", marginBottom: "1rem" }}>
              Selected: {formData.exercises.length} exercise(s)
            </p>

            <button type="submit" className="btn btn-primary">
              {editingWorkout ? "✏️ Update Workout" : "💾 Save Workout"}
            </button>
          </form>
        </div>
      )}

      {/* Workouts List */}
      {workouts.length > 0 ? (
        <div className="workout-list">
          {days.map((day) => {
            const dayWorkouts = workouts.filter((w) =>
              w.days ? w.days.includes(day) : w.day === day
            );
            if (dayWorkouts.length === 0) return null;

            return (
              <div key={day} style={{ marginBottom: "2rem" }}>
                <h2 style={{ color: "#ff6b6b", marginBottom: "1rem" }}>
                  {day}
                </h2>
                {dayWorkouts.map((workout) => (
                  <div key={workout.id} className="workout-item">
                    <div>
                      <h3>{workout.name}</h3>
                      <p
                        style={{
                          color: "#4ecdc4",
                          fontSize: "0.85rem",
                          marginBottom: "0.3rem",
                        }}
                      >
                        📅{" "}
                        {workout.days ? workout.days.join(", ") : workout.day}
                      </p>
                      <p>{workout.exercises.length} exercise(s)</p>
                      {workout.exercises.length > 0 && (
                        <div style={{ marginTop: "0.5rem" }}>
                          {workout.exercises.map((ex) => (
                            <Link
                              key={ex.id}
                              to={`/exercise/${ex.id}`}
                              className="tag tag-body"
                              style={{
                                marginRight: "0.3rem",
                                marginBottom: "0.3rem",
                                display: "inline-block",
                                cursor: "pointer",
                                textDecoration: "none",
                              }}
                            >
                              {ex.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => editWorkout(workout)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => deleteWorkout(workout.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Workouts Yet</h2>
          <p>Create your first workout plan to get started!</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
