import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Import Customer Pages
import Home from "./pages/Home/Home"; // Main home page
import CustomerLogin from "./features/customer/pages/Login/CustomerLogin";
import CustomerSignup from "./features/customer/pages/Signup/CustomerSignup";
import CustomerHome from "./features/customer/pages/Home/CustomerHome";
import CustomerMenuPage from "./features/customer/pages/Menu/CustomerMenu";
import CustomerProfilePage from "./features/customer/pages/Profile/CustomerProfile";
import CustomerFavoritesPage from "./features/customer/pages/Favorite/CustomerFavorite";
import CheckoutPage from "./features/customer/pages/Checkout/Checkout";
import OrderHistoryPage from "./features/customer/pages/Orders/OrderPage";
import OrderDetailsPage from "./features/customer/pages/OrderDetails/OrderDetailsPage";
import OrderConfirmation from "./features/customer/pages/OrderConfirmation/OrderConfirmation";

// Import Restaurant Pages
import RestaurantLogin from "./features/restaurant/pages/Login/RestaurantLogin";
import RestaurantSignup from "./features/restaurant/pages/Signup/RestaurantSignup";
import RestaurantHome from "./features/restaurant/pages/Home/RestaurantHome";
import RestaurantOrders from "./features/restaurant/pages/Orders/RestuarantOrders";
import RestaurantProfile from "./features/restaurant/pages/Profile/RestaurantProfile";


// Import Protected Routes
import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Customer Routes */}

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

      {/* Customer Protected Routes */}

      <Route path="/customer/home" element={
        <ProtectedRoute>
          <CustomerHome />
        </ProtectedRoute>
      } />

      <Route path="/customer/profile" element={
        <ProtectedRoute>
          <CustomerProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/customer/favorites" element={
        <ProtectedRoute>
          <CustomerFavoritesPage />
        </ProtectedRoute>
      } />

      <Route path="/customer/orders" element={
        <ProtectedRoute>
          <OrderHistoryPage />
        </ProtectedRoute>
      } />

      <Route path="/customer/orders/:orderId" element={
        <ProtectedRoute>
          <OrderDetailsPage />
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

      {/* Restaurant Routes */}

      <Route path="/login/restaurant" element={
        <PublicRoute>
          <RestaurantLogin />
        </PublicRoute>
      } />

      <Route path="/signup/restaurant" element={
        <PublicRoute>
          <RestaurantSignup />
        </PublicRoute>
      } />

      {/* Restaurant Protected Routes */}
      <Route path="/restaurant/home" element={
        <ProtectedRoute>
          <RestaurantHome />
        </ProtectedRoute>
      } />

      <Route path="/restaurant/orders" element={
        <ProtectedRoute>
          <RestaurantOrders />
        </ProtectedRoute>
      } />

      <Route path="/restaurant/profile" element={
        <ProtectedRoute>
          <RestaurantProfile />
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
