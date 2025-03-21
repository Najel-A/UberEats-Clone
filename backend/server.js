require('dotenv').config();
const mongoose = require('mongoose')
// const db = require('./config/connectDB'); Fix auto DB part later
const express = require('express');
const session = require('express-session');
const cors = require('cors');



// Import routes
const authCustomerRoutes = require('./routes/authCustomerRoutes');
const authRestaurantRoutes = require('./routes/authRestaurantRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dishRoutes = require('./routes/dishRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');

// Express app
const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'Accept'],
    exposedHeaders: ['set-cookie']
}));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: false, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    },
}));



// Mount routes
// app.use('/api/auth/customer', authCustomerRoutes);
// app.use('/api/auth/restaurant', authRestaurantRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/dishes', dishRoutes);
// app.use('/api/restaurants', restaurantRoutes);
// app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
