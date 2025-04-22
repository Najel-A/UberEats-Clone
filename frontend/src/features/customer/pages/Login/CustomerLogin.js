import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(email, password));
    console.log(result);
    navigate("/customer/home");
    // if (result.payload && !result.error) {
    //   navigate("/customer/home");
    // }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-content">
          <h2 className="login-title">Welcome Back</h2>
          {user ? <p className="success-message">Welcome, {user.name}!</p> : null}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input 
                type="email" 
                className="form-input" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                className="form-input" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {loading && <p className="loading-message">Logging in...</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;