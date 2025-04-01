const initialState = {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null
  };
  
  // Reducer
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOGIN_REQUEST":
        return { ...state, loading: true, error: null };
      case "LOGIN_SUCCESS":
        return { ...state, user: action.payload?.user || null, token: action.payload.token, loading: false };
      case "LOGIN_FAILURE":
        return { ...state, error: action.payload, loading: false };
      case "LOGOUT":
        return initialState;
      default:
        return state;
    }
  };
  
  // Action Creators
  const loginRequest = () => ({ type: "LOGIN_REQUEST" });
  const loginSuccess = (user, token) => ({ type: "LOGIN_SUCCESS", payload: { user, token } });
  const loginFailure = (error) => ({ type: "LOGIN_FAILURE", payload: error });
  const logout = () => ({ type: "LOGOUT" });
  
  // Async Action Creator (Thunk)
  const loginUser = (email, password) => async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch(loginSuccess(data.user, data.token));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
  
export { authReducer, loginUser, logout };
  