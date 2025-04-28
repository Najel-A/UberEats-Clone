// pages/OrderHistoryPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomerOrders } from '../../../../redux/slices/orderSlice';
import { Typography, CircularProgress } from '@mui/material';
import { Receipt, ReceiptLong, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderHistory, historyStatus, error } = useSelector((state) => state.order);
  const { token } = useSelector((state) => state.auth);
  const [localOrderHistory, setLocalOrderHistory] = useState([]);
  

  // Set up polling for order updates
  useEffect(() => {
    if (!token) return;

    // Initial fetch
    dispatch(getCustomerOrders());
    

    // Set up polling interval (every 10 seconds)
    const intervalId = setInterval(() => {
      dispatch(getCustomerOrders());
      console.log('Polling for order updates...');
    }, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [dispatch, token]);

  const formatDate = (dateString) => {
    try {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Date not available';
    }
  };

  const getOrderNumber = (order) => {
    if (!order || !order._id) return 'N/A';
    return order._id.slice(-6).toUpperCase();
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-idle';
    return `order-status status-${status.toLowerCase()}`;
  };

  const handleBack = () => {
    navigate('/customer/home');
  };

  if (historyStatus === 'loading') {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading orders: {error}
      </div>
    );
  }

  if (!orderHistory || !Array.isArray(orderHistory)) {
    return (
      <div className="error-message">
        No orders available. Please try again later.
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="page-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowBack />
          Back to Home
        </button>
        <Typography className="page-title">
          Order History
        </Typography>
      </div>

      <div className="orders-container">
        {orderHistory.length === 0 ? (
          <div className="empty-orders">
            <ReceiptLong className="empty-orders-icon" />
            <Typography className="empty-orders-text">
              No orders found
            </Typography>
          </div>
        ) : (
          orderHistory.map((order) => (
            order && (
              <div key={order._id} className="order-card" onClick={() => navigate(`/customer/orders/${order._id}`)}>
                <div className="order-header">
                  <Typography className="order-id">
                    Order #{getOrderNumber(order)}
                  </Typography>
                  <Typography className="order-date">
                    {formatDate(order.created_at)}
                  </Typography>
                </div>

                <div className="restaurant-info">
                  {order.restaurant_id?.profilePicture && (
                    <img
                      src={`http://localhost:5000${order.restaurant_id.profilePicture}`}
                      alt={order.restaurant_id?.name}
                      className="restaurant-image"
                      onError={(e) => {
                        e.target.src = '/restaurant-placeholder.png';
                      }}
                    />
                  )}
                  <div>
                    <Typography className="restaurant-name">
                      {order.restaurant_id?.name || 'Restaurant'}
                    </Typography>
                    <Typography className={getStatusClass(order.status)}>
                      {order.status || 'Status not available'}
                    </Typography>
                  </div>
                </div>

                <div className="order-items">
                  {(order.items || []).slice(0, 2).map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        {item.dish?.image && (
                          <img
                            src={`http://localhost:5000${item.dish.image}`}
                            alt={item.dish?.name}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = '/dish-placeholder.png';
                            }}
                          />
                        )}
                        <div className="item-details">
                          <Typography className="item-name">
                            {item.dish?.name || 'Item'}
                          </Typography>
                          <Typography className="item-quantity">
                            Quantity: {item.quantity || 0}
                          </Typography>
                        </div>
                      </div>
                      <Typography className="item-price">
                        ${((item.priceAtTime || 0) * (item.quantity || 0)).toFixed(2)}
                      </Typography>
                    </div>
                  ))}
                  {(order.items || []).length > 2 && (
                    <Typography className="item-quantity" style={{ textAlign: 'center', marginTop: '8px' }}>
                      +{order.items.length - 2} more items
                    </Typography>
                  )}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${(order.total_price || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${((order.total_price || 0) + 5).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;