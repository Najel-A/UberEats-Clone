// pages/OrderDetailsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, cancelOrder } from '../../../../redux/slices/orderSlice';
import { format, parseISO } from 'date-fns';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  console.log('Order ID:', orderId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedOrder, detailsStatus, cancelStatus } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId));
        alert('Order cancelled successfully');
      } catch (error) {
        alert(`Failed to cancel order: ${error}`);
      }
    }
  };

  // Safe date formatting function
  const formatOrderDate = (date) => {
    try {
      if (!date) return 'Date not available';
      
      // Handle both ISO strings and Date objects
      const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
      
      // Check if date is valid
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date received:', date);
        return 'Date not available';
      }
      
      return format(parsedDate, 'MMMM dd, yyyy - h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const getStatusColor = () => {
    if (!selectedOrder) return '';
    switch (selectedOrder.status) {
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

  if (detailsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (detailsStatus === 'failed' || !selectedOrder) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <button
          onClick={() => navigate('/customer/orders')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <button
          onClick={() => navigate('/customer/orders')}  // Fixed back button path
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}
            </h2>
            <p className="text-gray-600">
              {formatOrderDate(selectedOrder.createdAt)}  {/* Using safe date formatter */}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {selectedOrder.status}
          </span>
        </div>

        <div className="flex items-center mb-6">
          <img
            src={selectedOrder.restaurant?.profilePicture || '/restaurant-placeholder.png'}
            alt={selectedOrder.restaurant?.name || 'Restaurant'}
            className="w-16 h-16 rounded-full object-cover mr-4"
            onError={(e) => {
              e.target.src = '/restaurant-placeholder.png';
            }}
          />
          <div>
            <h3 className="font-semibold text-lg">{selectedOrder.restaurant?.name || 'Unknown Restaurant'}</h3>
            <p className="text-gray-600">{selectedOrder.items?.length || selectedOrder.orderItems?.length || 0} items</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Order Items</h3>
          <div className="space-y-4">
            {(selectedOrder.items || selectedOrder.orderItems || []).map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <img
                    src={item.dish?.image || '/dish-placeholder.png'}
                    alt={item.dish?.name || 'Dish'}
                    className="w-12 h-12 rounded object-cover mr-3"
                    onError={(e) => {
                      e.target.src = '/dish-placeholder.png';
                    }}
                  />
                  <div>
                    <p className="font-medium">{item.dish?.name || 'Unknown Dish'}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${((item.price || item.priceAtTime || 0) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${selectedOrder.subTotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Fee:</span>
            <span>${selectedOrder.deliveryFee?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>${selectedOrder.totalAmount?.toFixed(2) || selectedOrder.total_price?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-3">Delivery Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Delivery Address</p>
            <p className="font-medium">{selectedOrder.deliveryAddress || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Payment Method</p>
            <p className="font-medium">{selectedOrder.paymentMethod || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Contact Number</p>
            <p className="font-medium">{selectedOrder.contactNumber || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Special Instructions</p>
            <p className="font-medium">
              {selectedOrder.specialInstructions || 'None'}
            </p>
          </div>
        </div>
      </div>

      {selectedOrder.status === 'New' && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCancel}
            disabled={cancelStatus === 'loading'}
            className={`px-6 py-2 rounded-md ${
              cancelStatus === 'loading'
                ? 'bg-red-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            } transition-colors`}
          >
            {cancelStatus === 'loading' ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;