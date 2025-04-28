// pages/OrderDetailsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, cancelOrder } from '../../../../redux/slices/orderSlice';
import { format, parseISO } from 'date-fns';
import './OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedOrder, detailsStatus, cancelStatus } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const result = await dispatch(cancelOrder(orderId)).unwrap();
        if (result) {
          alert('Order cancelled successfully');
          // Refresh order details to show updated status
          dispatch(getOrderDetails(orderId));
        }
      } catch (error) {
        alert(`Failed to cancel order: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  const handleBack = () => {
    navigate('/customer/orders');
  };

  const formatOrderDate = (date) => {
    try {
      if (!date) return 'Date not available';
      const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
      if (isNaN(parsedDate.getTime())) return 'Date not available';
      return format(parsedDate, 'MMMM dd, yyyy - h:mm a');
    } catch (error) {
      return 'Date not available';
    }
  };

  const getStatusColor = () => {
    if (!selectedOrder) return '';
    switch (selectedOrder.status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'Ready': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (detailsStatus === 'loading') {
    return (
      <div className="order-details-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (detailsStatus === 'failed' || !selectedOrder) {
    return (
      <div className="order-details-container">
        <div className="order-main-card">
          <h2 className="section-title">Order not found</h2>
          <button
            onClick={handleBack}
            className="back-button"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      {/* Header Section */}
      <div className="order-details-header">
        <div>
          <h1 className="order-details-title">Order Details</h1>
          <p>{formatOrderDate(selectedOrder.created_at)}</p>
        </div>
        <button
          onClick={handleBack}
          className="back-button"
        >
          ← Back to Orders
        </button>
      </div>

      <div className="order-details-content">
        {/* Main Order Card */}
        <div className="order-main-card">
          {/* Order Header */}
          <div className="order-header-section">
            <div className="order-number">
              Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6).toUpperCase()}
            </div>
            <div className="restaurant-section">
              <img
                src={`http://localhost:5000${selectedOrder.restaurant_id?.profilePicture}` || '/restaurant-placeholder.png'}
                alt={selectedOrder.restaurant_id?.name || 'Restaurant'}
                className="restaurant-image"
                onError={(e) => e.target.src = '/restaurant-placeholder.png'}
              />
              <span className="restaurant-name">{selectedOrder.restaurant_id?.name || 'Unknown Restaurant'}</span>
            </div>
            <span className={`order-status-badge ${getStatusColor()}`}>
              {selectedOrder.status}
            </span>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3 className="section-title">Order Items</h3>
            <div>
              {(selectedOrder.items || selectedOrder.orderItems || []).map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-details">
                    <img
                      src={`http://localhost:5000${item.dish?.image}` || '/dish-placeholder.png'}
                      alt={item.dish?.name}
                      className="item-image"
                      onError={(e) => e.target.src = '/dish-placeholder.png'}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.dish?.name || 'Unknown Dish'}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="item-note">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="item-price">
                    ${((item.price || item.priceAtTime || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${selectedOrder.subTotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>${selectedOrder.deliveryFee?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>
                ${selectedOrder.totalAmount?.toFixed(2) || selectedOrder.total_price?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Cancel Button */}
          {selectedOrder.status === 'New' && (
            <div className="cancel-button-container">
              <button
                onClick={handleCancel}
                disabled={cancelStatus === 'loading'}
                className="cancel-button"
              >
                {cancelStatus === 'loading' ? (
                  <>
                    <div className="loading-spinner"></div>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;