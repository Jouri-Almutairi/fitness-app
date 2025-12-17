import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section">
          <h3>💪 FitZone</h3>
          <p>
            Your ultimate fitness companion. Discover thousands of exercises and
            build your perfect workout routine.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/exercises">Exercises</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/workout-plan">Workout Plan</Link>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3>Categories</h3>
          <Link to="/exercises">Back Exercises</Link>
          <Link to="/exercises">Chest Exercises</Link>
          <Link to="/exercises">Leg Exercises</Link>
          <Link to="/exercises">Arm Exercises</Link>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📧 info@fitzone.com</p>
          <p>📱 +1 (555) 123-4567</p>
          <p>📍 123 Fitness Street, NY</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          © 2024 FitZone. All rights reserved. Built with ❤️ for fitness lovers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
