import "../styles/Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <>
      {/* Top Information Bar */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-left">
            <span>24/7 Premium Chauffeur Service</span>
          </div>

          <div className="top-right">
            <span>Dubai, UAE</span>
            <span className="top-divider">|</span>
            <span>Available 24 Hours</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img
              src={logo}
              alt="Al Humaidi Luxury Transport LLC"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>

            <Link to="/" onClick={closeMenu}>
              Home
            </Link>

            <Link to="/about" onClick={closeMenu}>
              About Us
            </Link>

            {/* Services Dropdown */}
            <div
              className="services-dropdown"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="services-button"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <span className={`arrow ${servicesOpen ? "rotate" : ""}`}>
                  ↓
                </span>
              </button>

              {servicesOpen && (
                <div className="dropdown-menu">

                  <Link to="/services/luxury-transport" onClick={closeMenu}>
                    <span className="dropdown-icon">◆</span>
                    <div>
                      <strong>Luxury Transportation</strong>
                      <small>Premium private transfers</small>
                    </div>
                  </Link>

                  <Link to="/services/chauffeur" onClick={closeMenu}>
                    <span className="dropdown-icon">◆</span>
                    <div>
                      <strong>Chauffeur Service</strong>
                      <small>Professional personal drivers</small>
                    </div>
                  </Link>

                  <Link to="/services/airport-transfer" onClick={closeMenu}>
                    <span className="dropdown-icon">◆</span>
                    <div>
                      <strong>Airport Transfers</strong>
                      <small>Comfortable airport journeys</small>
                    </div>
                  </Link>

                  <Link to="/services/corporate" onClick={closeMenu}>
                    <span className="dropdown-icon">◆</span>
                    <div>
                      <strong>Corporate Travel</strong>
                      <small>Executive transportation</small>
                    </div>
                  </Link>

                </div>
              )}
            </div>

            <Link to="/fleet" onClick={closeMenu}>
              Fleet
            </Link>

            <Link to="/blog" onClick={closeMenu}>
              Blog
            </Link>

            <Link to="/contact" onClick={closeMenu}>
              Contact
            </Link>

            {/* Login */}
            <Link
              to="/driver-login"
              className="driver-login-button mobile-login"
              onClick={closeMenu}
            >
              Driver Login
              <span>→</span>
            </Link>
          </nav>

          {/* Desktop Login */}
          <Link
            to="/driver-login"
            className="driver-login-button desktop-login"
          >
            Driver Login
            <span>→</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </header>
    </>
  );
}

export default Navbar;
