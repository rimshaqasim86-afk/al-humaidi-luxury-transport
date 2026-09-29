import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import API from "./api";
import logo from "./assets/logo.png";

import "./App.css";

// ======================================================
// GET LOGGED IN USER
// ======================================================

function getLoggedInUser() {
  try {
    const sessionUser = sessionStorage.getItem("user");

    if (sessionUser) {
      return JSON.parse(sessionUser);
    }

    const localUser = localStorage.getItem("user");

    if (localUser) {
      return JSON.parse(localUser);
    }

    return null;
  } catch (error) {
    console.error("User storage error:", error);
    return null;
  }
}

// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({ children }) {
  const user = getLoggedInUser();

  if (!user) {
    return <Navigate to="/driver-login" replace />;
  }

  return children;
}

// ======================================================
// PASSWORD FIELD
// ======================================================

function PasswordField({
  value,
  onChange,
  name = "password",
  placeholder = "Enter your password",
  autoComplete = "current-password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={
          showPassword ? "Hide password" : "Show password"
        }
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
}

// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Al Humaidi Luxury Transport LLC"
          />
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <a href="#services">Services</a>

          <a href="#about">About</a>

          <Link
            to="/driver-login"
            className="login-nav"
          >
            Driver Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            AL HUMAIDI LUXURY TRANSPORT LLC
          </p>

          <h1>
            PREMIUM
            <span> TRANSPORTATION</span>
          </h1>

          <p className="hero-description">
            Experience professional, reliable and
            luxurious transportation services with
            Al Humaidi Luxury Transport LLC.
          </p>

          <Link
            to="/driver-login"
            className="hero-button"
          >
            DRIVER PORTAL →
          </Link>

        </div>

      </section>

      {/* SERVICES */}
      <section
        className="services-section"
        id="services"
      >
        <div className="section-heading">

          <p>WHAT WE OFFER</p>

          <h2>
            Our <span>Services</span>
          </h2>

        </div>

        <div className="services-grid">

          <div className="service-card">

            <div className="service-icon">
              ◆
            </div>

            <h3>
              Luxury Transportation
            </h3>

            <p>
              Premium transportation services
              designed for comfort, safety and
              elegance.
            </p>

          </div>

          <div className="service-card">

            <div className="service-icon">
              ◆
            </div>

            <h3>
              Professional Drivers
            </h3>

            <p>
              Experienced and professional drivers
              committed to providing excellent
              customer service.
            </p>

          </div>

          <div className="service-card">

            <div className="service-icon">
              ◆
            </div>

            <h3>
              Customer Service
            </h3>

            <p>
              Reliable support and personalized
              transportation solutions for every
              guest.
            </p>

          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <p className="section-label">
            ABOUT US
          </p>

          <h2>
            Travel With
            <span> Confidence</span>
          </h2>

          <p>
            Al Humaidi Luxury Transport LLC provides
            professional transportation solutions with
            a strong focus on reliability, comfort and
            customer satisfaction.
          </p>

          <p>
            Our professional drivers and premium
            vehicles are dedicated to delivering a
            smooth and comfortable transportation
            experience.
          </p>

        </div>

      </section>

      {/* CONTACT */}
      <section
        className="contact-section"
        id="contact"
      >

        <div className="section-heading">

          <p>GET IN TOUCH</p>

          <h2>
            Contact <span>Us</span>
          </h2>

        </div>

        <div className="contact-box">

          <p>
            For transportation inquiries and
            professional driver services, please
            contact Al Humaidi Luxury Transport LLC.
          </p>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-logo">
          <img
            src={logo}
            alt="Al Humaidi Luxury Transport LLC"
          />
        </div>

        <p>
          © 2026 Al Humaidi Luxury Transport LLC.
          All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

// ======================================================
// DRIVER LOGIN
// ======================================================

function DriverLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ----------------------------------------------------
  // HANDLE INPUT
  // ----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    const userId = formData.userId.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (!userId || !email || !password) {
      setError(
        "User ID, email and password are required"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/users/login",
        {
          userId,
          email,
          password,
        }
      );

      if (response.data.success) {

        // Remove previous login
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        // Save user
        if (rememberMe) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        } else {
          sessionStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

        // Open Job Order Form
        navigate("/job-order");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        {/* LOGO */}
        <Link
          to="/"
          className="auth-logo"
        >
          <img
            src={logo}
            alt="Al Humaidi Luxury Transport LLC"
          />
        </Link>

        <h1>
          Driver Login
        </h1>

        <p className="auth-subtitle">
          Login to access your driver portal
        </p>

        <form onSubmit={handleLogin}>

          {/* USER ID */}
          <div className="form-group">

            <label>
              User ID
            </label>

            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Enter your User ID"
              autoComplete="username"
              required
            />

          </div>

          {/* EMAIL */}
          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label>
              Password
            </label>

            <PasswordField
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </div>

          {/* REMEMBER ME */}
          <label className="remember-me">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(
                  e.target.checked
                )
              }
            />

            <span>
              Remember me
            </span>

          </label>

          {/* ERROR */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "LOGGING IN..."
              : "LOGIN"}
          </button>

        </form>

        {/* REGISTER */}
        <div className="register-link">

          Don't have an account?

          <Link to="/register">
            Register here
          </Link>

        </div>

        {/* BACK HOME */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

// ======================================================
// REGISTER
// ======================================================

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      userId: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ----------------------------------------------------
  // HANDLE INPUT
  // ----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ----------------------------------------------------
  // REGISTER
  // ----------------------------------------------------

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const userId = formData.userId.trim();
    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;

    // Required fields
    if (
      !name ||
      !userId ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "All fields are required"
      );
      return;
    }

    // Password length
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ================================================
      // CREATE USER API
      // ================================================

      const response = await API.post(
        "/users/create",
        {
          userId: userId,
          name: name,
          email: email,
          password: password,
          role: "driver",
        }
      );

      if (response.data.success) {

        setSuccess(
          "Registration successful! Redirecting to login..."
        );

        // Clear form
        setFormData({
          name: "",
          userId: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Go login
        setTimeout(() => {
          navigate("/driver-login");
        }, 1500);
      }
    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        {/* LOGO */}
        <Link
          to="/"
          className="auth-logo"
        >
          <img
            src={logo}
            alt="Al Humaidi Luxury Transport LLC"
          />
        </Link>

        <h1>
          Driver Registration
        </h1>

        <p className="auth-subtitle">
          Create your driver account
        </p>

        <form onSubmit={handleRegister}>

          {/* NAME */}
          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

          </div>

          {/* USER ID */}
          <div className="form-group">

            <label>
              User ID
            </label>

            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Create User ID"
              autoComplete="username"
              required
            />

          </div>

          {/* EMAIL */}
          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label>
              Password
            </label>

            <PasswordField
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Create password"
              autoComplete="new-password"
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <PasswordField
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              name="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "CREATING ACCOUNT..."
              : "REGISTER"}
          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="register-link">

          Already have an account?

          <Link to="/driver-login">
            Login here
          </Link>

        </div>

        {/* HOME */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

// ======================================================
// JOB ORDER
// ======================================================

function JobOrder() {
  const navigate = useNavigate();

  const user = getLoggedInUser();

  const [formData, setFormData] =
    useState({
      mt: "",
      guestName: "",
      guestEmail: "",
      roomNo: "",
      transportationForm: "",
      tripDestination: "",
      amount: "",
      flightNo: "",
      driverName:
        user?.name || "",
      driverContact: "",
      plateNo: "",
      carNo: "",
      vehicleName: "",
      description: "",
      sentBy:
        user?.name || "",
    });

  const [error, setError] =
    useState("");

  // ----------------------------------------------------
  // HANDLE CHANGE
  // ----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ----------------------------------------------------
  // SUBMIT JOB ORDER
  // ----------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    // Required fields
    if (
      !formData.mt ||
      !formData.guestName ||
      !formData.guestEmail ||
      !formData.roomNo ||
      !formData.transportationForm ||
      !formData.tripDestination ||
      !formData.amount ||
      !formData.driverName ||
      !formData.driverContact ||
      !formData.plateNo ||
      !formData.carNo ||
      !formData.vehicleName ||
      !formData.sentBy
    ) {
      setError(
        "Please fill all required fields"
      );
      return;
    }

    // Open receipt
    navigate(
      "/job-order-receipt",
      {
        state: formData,
      }
    );
  };

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    navigate("/driver-login");
  };

  return (
    <div className="job-order-page">

      {/* DASHBOARD NAVBAR */}
      <nav className="dashboard-navbar">

        <Link
          to="/job-order"
          className="logo"
        >
          <img
            src={logo}
            alt="Al Humaidi Luxury Transport LLC"
          />
        </Link>

        <div className="dashboard-user">

          <span>
            Welcome,{" "}
            {user?.name || "Driver"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* JOB ORDER CONTENT */}
      <main className="job-order-container">

        <div className="job-order-header">

          <p>
            AL HUMAIDI LUXURY TRANSPORT LLC
          </p>

          <h1>
            Job Order
          </h1>

          <span>
            Enter customer and transportation
            details below
          </span>

        </div>

        <form
          className="job-order-form"
          onSubmit={handleSubmit}
        >

          {/* MT */}
          <div className="form-group">

            <label>
              MT *
            </label>

            <input
              type="text"
              name="mt"
              value={formData.mt}
              onChange={handleChange}
              placeholder="Enter MT"
              required
            />

          </div>

          {/* GUEST NAME */}
          <div className="form-group">

            <label>
              Guest Name *
            </label>

            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              placeholder="Enter guest name"
              required
            />

          </div>

          {/* GUEST EMAIL */}
          <div className="form-group">

            <label>
              Guest Email *
            </label>

            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              placeholder="Enter guest email"
              autoComplete="email"
              required
            />

          </div>

          {/* ROOM NO */}
          <div className="form-group">

            <label>
              Room No *
            </label>

            <input
              type="text"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
              placeholder="Enter room number"
              required
            />

          </div>

          {/* TRANSPORTATION FORM */}
          <div className="form-group">

            <label>
              Transportation Form *
            </label>

            <select
              name="transportationForm"
              value={
                formData.transportationForm
              }
              onChange={handleChange}
              required
            >
              <option value="">
                Select transportation
              </option>

              <option value="Airport Transfer">
                Airport Transfer
              </option>

              <option value="Hotel Transfer">
                Hotel Transfer
              </option>

              <option value="City Transfer">
                City Transfer
              </option>

              <option value="Point to Point">
                Point to Point
              </option>

              <option value="Hourly">
                Hourly
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          {/* TRIP DESTINATION */}
          <div className="form-group">

            <label>
              Trip Destination *
            </label>

            <input
              type="text"
              name="tripDestination"
              value={
                formData.tripDestination
              }
              onChange={handleChange}
              placeholder="Enter trip destination"
              required
            />

          </div>

          {/* AMOUNT */}
          <div className="form-group">

            <label>
              Amount of Trip (AED) *
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount in AED"
              min="0"
              step="0.01"
              required
            />

          </div>

          {/* FLIGHT NO */}
          <div className="form-group">

            <label>
              Flight No
            </label>

            <input
              type="text"
              name="flightNo"
              value={formData.flightNo}
              onChange={handleChange}
              placeholder="Enter flight number if any"
            />

          </div>

          {/* DRIVER NAME */}
          <div className="form-group">

            <label>
              Driver Name *
            </label>

            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Driver name"
              required
            />

          </div>

          {/* DRIVER CONTACT */}
          <div className="form-group">

            <label>
              Driver Contact No *
            </label>

            <input
              type="tel"
              name="driverContact"
              value={
                formData.driverContact
              }
              onChange={handleChange}
              placeholder="Enter driver contact number"
              required
            />

          </div>

          {/* PLATE NO */}
          <div className="form-group">

            <label>
              Plate No *
            </label>

            <input
              type="text"
              name="plateNo"
              value={formData.plateNo}
              onChange={handleChange}
              placeholder="Enter plate number"
              required
            />

          </div>

          {/* CAR NO */}
          <div className="form-group">

            <label>
              Car No *
            </label>

            <input
              type="text"
              name="carNo"
              value={formData.carNo}
              onChange={handleChange}
              placeholder="Enter car number"
              required
            />

          </div>

          {/* VEHICLE NAME */}
          <div className="form-group">

            <label>
              Vehicle Name *
            </label>

            <input
              type="text"
              name="vehicleName"
              value={
                formData.vehicleName
              }
              onChange={handleChange}
              placeholder="Enter vehicle name"
              required
            />

          </div>

          {/* DESCRIPTION */}
          <div className="form-group full-width">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Enter additional details"
              rows="5"
            />

          </div>

          {/* SENT BY */}
          <div className="form-group">

            <label>
              Sent By *
            </label>

            <input
              type="text"
              name="sentBy"
              value={formData.sentBy}
              onChange={handleChange}
              placeholder="Enter sender name"
              required
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="error-message full-width">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <div className="job-order-actions full-width">

            <button
              type="submit"
              className="auth-button"
            >
              SEND REQUEST →
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

// ======================================================
// RECEIPT ITEM
// ======================================================

function Item({ label, value }) {
  return (
    <div className="receipt-item">

      <span className="receipt-label">
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  );
}

// ======================================================
// JOB ORDER RECEIPT
// ======================================================

function JobOrderReceipt() {
  const navigate = useNavigate();

  const location = useLocation();

  const data =
    location.state || null;

  // ----------------------------------------------------
  // NO DATA
  // ----------------------------------------------------

  if (!data) {
    return (
      <div className="receipt-page">

        <div className="receipt-box">

          <div className="receipt-header">

            <img
              src={logo}
              alt="Al Humaidi Luxury Transport LLC"
            />

            <h1>
              Job Order Receipt
            </h1>

          </div>

          <div className="error-message">
            No job order data found.
          </div>

          <button
            type="button"
            className="auth-button"
            onClick={() =>
              navigate("/job-order")
            }
          >
            CREATE NEW JOB ORDER
          </button>

        </div>

      </div>
    );
  }

  // ----------------------------------------------------
  // PRINT
  // ----------------------------------------------------

  const handlePrint = () => {
    window.print();
  };

  // ----------------------------------------------------
  // NEW JOB ORDER
  // ----------------------------------------------------

  const handleNewJobOrder = () => {
    navigate("/job-order");
  };

  return (
    <div className="receipt-page">

      <div className="receipt-box">

        {/* RECEIPT HEADER */}
        <div className="receipt-header">

          <img
            src={logo}
            alt="Al Humaidi Luxury Transport LLC"
          />

          <p>
            AL HUMAIDI LUXURY TRANSPORT LLC
          </p>

          <h1>
            JOB ORDER RECEIPT
          </h1>

          <span>
            Transportation Service Record
          </span>

        </div>

        {/* RECEIPT DETAILS */}
        <div className="receipt-details">

          <Item
            label="MT"
            value={data.mt}
          />

          <Item
            label="Guest Name"
            value={data.guestName}
          />

          <Item
            label="Guest Email"
            value={data.guestEmail}
          />

          <Item
            label="Room No"
            value={data.roomNo}
          />

          <Item
            label="Transportation Form"
            value={
              data.transportationForm
            }
          />

          <Item
            label="Trip Destination"
            value={
              data.tripDestination
            }
          />

          <Item
            label="Amount of Trip (AED)"
            value={
              data.amount
                ? `AED ${data.amount}`
                : "-"
            }
          />

          <Item
            label="Flight No"
            value={data.flightNo}
          />

          <Item
            label="Driver Name"
            value={data.driverName}
          />

          <Item
            label="Driver Contact No"
            value={
              data.driverContact
            }
          />

          <Item
            label="Plate No"
            value={data.plateNo}
          />

          <Item
            label="Car No"
            value={data.carNo}
          />

          <Item
            label="Vehicle Name"
            value={
              data.vehicleName
            }
          />

          <Item
            label="Description"
            value={
              data.description
            }
          />

          <Item
            label="Sent By"
            value={data.sentBy}
          />

        </div>

        {/* RECEIPT FOOTER */}
        <div className="receipt-footer">

          <p>
            Thank you for choosing
            Al Humaidi Luxury Transport LLC.
          </p>

        </div>

        {/* ACTIONS */}
        <div className="receipt-actions">

          <button
            type="button"
            className="auth-button"
            onClick={handlePrint}
          >
            PRINT RECEIPT
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleNewJobOrder}
          >
            NEW JOB ORDER
          </button>

          <Link
            to="/"
            className="back-home"
          >
            ← Home
          </Link>

        </div>

      </div>

    </div>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/driver-login"
          element={<DriverLogin />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* JOB ORDER */}
        <Route
          path="/job-order"
          element={
            <ProtectedRoute>
              <JobOrder />
            </ProtectedRoute>
          }
        />

        {/* RECEIPT */}
        <Route
          path="/job-order-receipt"
          element={
            <ProtectedRoute>
              <JobOrderReceipt />
            </ProtectedRoute>
          }
        />

        {/* ANY WRONG URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;