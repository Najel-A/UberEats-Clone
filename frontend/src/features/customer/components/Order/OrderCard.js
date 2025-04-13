// components/OrderCard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cancelOrder } from '../../../../redux/slices/orderSlice';
import { format, parseISO } from 'date-fns';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/customer/orders/${order._id}`);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(order._id));
        alert('Order cancelled successfully');
      } catch (error) {
        alert(`Failed to cancel order: ${error}`);
      }
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Ready': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatOrderDate = (date) => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
      if (isNaN(parsedDate.getTime())) return 'Date not available';
      return format(parsedDate, 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return 'Date not available';
    }
  };
  return (
    <div className="restaurant-card">
      <div className="restaurant-link">
        {/* Header with order info */}
        <div className="restaurant-header p-4 pb-2">
          <div className="flex justify-between items-start">
            <h3 className="restaurant-name">
              Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()} border`}>
              {order.status}
            </span>
          </div>
          <p className="restaurant-cuisine text-sm mt-1">
            {formatOrderDate(order.created_at)}
          </p>
        </div>

        {/* Restaurant info with fixed image */}
        <div className="restaurant-image-container">
          <img 
            src={`http://localhost:5000${order.restaurant_id.profilePicture}` || '/restaurant-placeholder.png'} 
            alt={order.restaurant?.name}
            className="restaurant-image"
            onError={(e) => {
              e.target.src = '/restaurant-placeholder.png';
            }}
          />
        </div>

        {/* Order details */}
        <div className="restaurant-info">
          <div className="mb-3">
            <p className="font-semibold text-gray-800">
              {order.restaurant_id?.name || 'Unknown Restaurant'}
            </p>
            <p className="restaurant-cuisine">
              {order.items?.length || order.orderItems?.length || 0} items
            </p>
          </div>

          <div className="mb-4">
            <p className="text-lg font-bold text-gray-900">
              ${order.totalAmount?.toFixed(2) || order.total_price?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="restaurant-footer px-4 pb-4">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          {order.status === 'New' && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;