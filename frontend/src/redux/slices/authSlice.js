const initialState = {
  user: null,       // Will store { name, role }
  token: null,      // JWT token
  role: null,       // User role (also stored in user object)
  loading: false,
  error: null
};

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "SIGNUP_REQUEST":
      return { ...state, loading: true, error: null };
    
    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      console.log("Reducer processing auth success:", action.payload);
      return {
        ...state,
        user: action.payload.name,
        token: action.payload.token,
        role: action.payload.role,
        loading: false,
        error: null
      };
    
    case "LOGIN_FAILURE":
    case "SIGNUP_FAILURE":
      return { ...state, error: action.payload, loading: false };
    
    case "LOGOUT":
      return initialState;
    
    default:
      return state;
  }
};

// Action Creators
const loginRequest = () => ({ type: "LOGIN_REQUEST" });
const loginSuccess = (responseData) => ({ 
  type: "LOGIN_SUCCESS", 
  payload: {
    token: responseData.token,
    name: responseData.name,
    role: responseData.role
  }
});
const loginFailure = (error) => ({ type: "LOGIN_FAILURE", payload: error });

const signupRequest = () => ({ type: "SIGNUP_REQUEST" });
const signupSuccess = (responseData) => ({ 
  type: "SIGNUP_SUCCESS", 
  payload: {
    token: responseData.token,
    name: responseData.name,
    role: responseData.role
  }
});
const signupFailure = (error) => ({ type: "SIGNUP_FAILURE", payload: error });

const logout = () => ({ type: "LOGOUT" });

// Async Action Creators (Thunks)
const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log("Login backend response:", data);
    
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    dispatch(loginSuccess(data));
    
    // Optional: Save to localStorage
    // localStorage.setItem("authToken", data.token);
    // localStorage.setItem("userRole", data.role);
    
  } catch (error) {
    console.error("Login error:", error);
    dispatch(loginFailure(error.message));
  }
};

const signupUser = (userData) => async (dispatch) => {
  dispatch(signupRequest());
  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    console.log("Signup backend response:", data);
    
    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    dispatch(signupSuccess(data));
    
    // Optional: Save to localStorage
    // localStorage.setItem("authToken", data.token);
    // localStorage.setItem("userRole", data.role);
    
  } catch (error) {
    console.error("Signup error:", error);
    dispatch(signupFailure(error.message));
  }
};

export { authReducer, loginUser, signupUser, logout };