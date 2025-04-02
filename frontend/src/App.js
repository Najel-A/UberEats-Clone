import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import CustomerLogin from './features/customer/pages/Login/CustomerLogin';
import CustomerSignup from './features/customer/pages/Signup/CustomerSignup';
import CustomerHome from './features/customer/pages/Home/CustomerHome';
import store from './redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/customer" element={<CustomerLogin />} />
            <Route path="/signup/customer" element={<CustomerSignup />} />
            <Route path="/customer/home" element={<CustomerHome />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;