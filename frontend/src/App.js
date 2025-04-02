import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import CustomerLogin from './features/customer/pages/Login/CustomerLogin';
import CustomerSignup from './features/customer/pages/Signup/CustomerSignup';
import CustomerHome from './features/customer/pages/Home/CustomerHome';
import CustomerMenuPage from './features/customer/pages/Menu/CustomerMenu';
import CheckoutPage from './features/customer/pages/Checkout/Checkout';
import OrderConfirmation from './features/customer/pages/OrderConfirmation/OrderConfirmation';
import store from './redux/store';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';

// Create a Protected Route component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/login/customer" replace />;
  }
  
  return children;
};

// Create a Public Route component (for logged out users)
const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (token) {
    return <Navigate to="/customer/home" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login/customer" element={
        <PublicRoute>
          <CustomerLogin />
        </PublicRoute>
      } />
      
      <Route path="/signup/customer" element={
        <PublicRoute>
          <CustomerSignup />
        </PublicRoute>
      } />
      
      <Route path="/customer/home" element={
        <ProtectedRoute>
          <CustomerHome />
        </ProtectedRoute>
      } />


      <Route path="/restaurants/:restaurantId/menu" element={
        <ProtectedRoute>
          <CustomerMenuPage />
        </ProtectedRoute>
      } />

      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/order-confirmation" element={
        <ProtectedRoute>
          <OrderConfirmation />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;