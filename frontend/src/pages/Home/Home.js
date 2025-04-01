import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center">
      {/* Navbar */}
      <nav className="w-100 bg-white shadow py-3 px-4 d-flex justify-content-between align-items-center">
        <h1 className="display-4 fw-bold">
          Uber<span className="text-success">Eats</span>
        </h1>
      </nav>
      
      {/* Hero Section */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100 container mt-5 p-4">
        {/* Left Side - Text */}
        <div className="col-md-6 text-center text-md-start">
          <h2 className="display-2 fw-bold">
            Crave. Order. <span className="text-success">Enjoy.</span>
          </h2>
          <p className="lead text-muted mt-3">
            Order your favorite food or manage your restaurant!
          </p>
        </div>

        {/* Right Side - Image & Login Box */}
        <div className="col-md-6 d-flex flex-column align-items-center">
          <img
            src="/path-to-your-image.jpg"
            alt="Food"
            className="img-fluid rounded shadow-sm"
          />
          
          {/* Login Box */}
          <div className="mt-4 bg-white p-4 shadow rounded w-75 text-center">
            <h3 className="h2 fw-bold mb-4">Welcome!</h3>
            <div className="dropdown mb-3">
              <button className="btn btn-success dropdown-toggle w-100 fw-bold" type="button" id="loginDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Login
              </button>
              <ul className="dropdown-menu w-100" aria-labelledby="loginDropdown">
                <li><a className="dropdown-item" href="/login/customer">Login as Customer</a></li>
                <li><a className="dropdown-item" href="/login/restaurant">Login as Restaurant</a></li>
              </ul>
            </div>
            <div className="dropdown">
              <button className="btn btn-outline-success dropdown-toggle w-100 fw-bold" type="button" id="signupDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Sign Up
              </button>
              <ul className="dropdown-menu w-100" aria-labelledby="signupDropdown">
                <li><a className="dropdown-item" href="/signup/customer">Sign Up as Customer</a></li>
                <li><a className="dropdown-item" href="/signup/restaurant">Sign Up as Restaurant</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;