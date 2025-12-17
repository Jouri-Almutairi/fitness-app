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

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>📸 Instagram</p>
          <p>🐦 Twitter</p>
          <p>📘 Facebook</p>
          <p>▶️ YouTube</p>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📧 info@fitzone.com</p>
          <p>📱 +966 50 123 4567</p>
          <p>📍 Jeddah, Saudi Arabia</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          © 2025 FitZone. All rights reserved. Built with ❤️ for fitness lovers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
