// PublicRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  
  if (token) {
    return <Navigate to="/customer/home" replace />;
  }
  
  return children;
};

export default PublicRoute;