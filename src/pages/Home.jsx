import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Transform Your Body <br />
            With <span>FitZone</span>
          </h1>
          <p>
            Discover over 1,300+ exercises with detailed instructions, animated
            demonstrations, and personalized workout plans. Start your fitness
            journey today!
          </p>
          <div className="hero-buttons">
            <Link to="/exercises" className="btn btn-primary">
              🏋️ Browse Exercises
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-outline">
                ✨ Join Now - It's Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">
            Why Choose <span>FitZone</span>?
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>1,300+ Exercises</h3>
              <p>
                Access a huge library of exercises targeting every muscle group
                with detailed instructions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Animated GIFs</h3>
              <p>
                Visual demonstrations for each exercise to ensure proper form
                and technique.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Save Favorites</h3>
              <p>
                Create your personal collection of favorite exercises for quick
                access anytime.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Workout Plans</h3>
              <p>
                Build custom workout routines tailored to your fitness goals and
                schedule.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>
                Find exercises by name, body part, target muscle, or equipment
                needed.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Fully Responsive</h3>
              <p>
                Access your workouts anywhere - desktop, tablet, or mobile
                device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ minHeight: "50vh" }}>
        <div className="hero-content">
          <h2 style={{ fontSize: "2.5rem" }}>
            Ready to Start Your <span>Fitness Journey</span>?
          </h2>
          <p>
            Join thousands of users who are already transforming their bodies
            with FitZone.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/exercises" className="btn btn-primary">
                🚀 Start Exploring
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  🎉 Create Free Account
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Already have an account?
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
