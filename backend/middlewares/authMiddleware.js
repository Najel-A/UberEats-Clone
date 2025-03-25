// Middleware to check authentication
const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    console.log(token);
    if (!token) return res.status(401).json({ message: "Access denied. No token provided" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
  
  // Middleware to check roles
  exports.isCustomer = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access forbidden: Customers only" });
    }
  
    next();
  };
  
  
  exports.isRestaurant = (req, res, next) => {
    if (req.user.role !== "restaurant") {
      return res.status(403).json({ message: "Access forbidden: Restaurants only" });
    }
    next();
  };
  