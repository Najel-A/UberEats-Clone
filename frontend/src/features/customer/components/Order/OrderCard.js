// components/OrderCard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cancelOrder } from '../../../../redux/slices/orderSlice';
import { format, parseISO } from 'date-fns';

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/customer/orders/${order._id}`);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(order._id)).unwrap();
        alert('Order cancelled successfully');
      } catch (error) {
        alert(`Failed to cancel order: ${error}`);
      }
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Safe date formatting function
  const formatOrderDate = (date) => {
    try {
      // Handle both ISO strings and Date objects
      const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
      
      // Check if date is valid
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date received:', date);
        return 'Date not available';
      }
      
      return format(parsedDate, 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">
            Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
          </h3>
          <p className="text-gray-600 text-sm">
            {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {order.status}
        </span>
      </div>

      <div className="flex items-center mb-3">
        <img 
          src={order.restaurant?.profilePicture || '/restaurant-placeholder.png'} 
          alt={order.restaurant?.name || 'Restaurant'}
          className="w-10 h-10 rounded-full object-cover mr-3"
          onError={(e) => {
            e.target.src = '/restaurant-placeholder.png';
          }}
        />
        <div>
          <p className="font-medium">{order.restaurant?.name || 'Unknown Restaurant'}</p>
          <p className="text-gray-600 text-sm">
            {order.items?.length || order.orderItems?.length || 0} items
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p className="font-semibold">
          Total: ${order.totalAmount?.toFixed(2) || order.total_price?.toFixed(2) || '0.00'}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleViewDetails}
          className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm"
        >
          View Details
        </button>
        {order.status === 'New' && (
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
            disabled={order.status !== 'New'}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;