// pages/OrderDetailsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, cancelOrder } from '../../../../redux/slices/orderSlice';
import { format, parseISO } from 'date-fns';

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
        await dispatch(cancelOrder(orderId));
        alert('Order cancelled successfully');
      } catch (error) {
        alert(`Failed to cancel order: ${error}`);
      }
    }
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
      case 'New': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Ready': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (detailsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (detailsStatus === 'failed' || !selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-4">Order not found</h2>
          <button
            onClick={() => navigate('/customer/orders')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  console.log('Selected Order:', selectedOrder);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 mt-1">
            {formatOrderDate(selectedOrder.created_at)}
          </p>
        </div>
        <button
          onClick={() => navigate('/customer/orders')}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          ← Back to Orders
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6).toUpperCase()}
              </h2>
              <div className="flex items-center mt-2">
                <img
                  src={`http://localhost:5000${selectedOrder.restaurant_id?.profilePicture}` || '/restaurant-placeholder.png'}
                  alt={selectedOrder.restaurant_id?.name || 'Restaurant'}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                  onError={(e) => e.target.src = '/restaurant-placeholder.png'}
                />
                <span className="font-medium">{selectedOrder.restaurant_id?.name || 'Unknown Restaurant'}</span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {selectedOrder.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Items</h3>
          <div className="space-y-4">
            {(selectedOrder.items || selectedOrder.orderItems || []).map((item, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={`http://localhost:5000${item.dish?.image}` || '/dish-placeholder.png'}
                      alt={item.dish?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/dish-placeholder.png'}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.dish?.name || 'Unknown Dish'}</p>
                    <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-gray-500 text-sm mt-1">
                        <span className="font-medium">Note:</span> {item.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  ${((item.price || item.priceAtTime || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-50">
          <div className="max-w-md ml-auto">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${selectedOrder.subTotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">${selectedOrder.deliveryFee?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-lg">
                ${selectedOrder.totalAmount?.toFixed(2) || selectedOrder.total_price?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Delivery Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h4>
              <p className="text-gray-900">{selectedOrder.deliveryAddress || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
              <p className="text-gray-900">{selectedOrder.paymentMethod || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Number</h4>
              <p className="text-gray-900">{selectedOrder.contactNumber || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Special Instructions</h4>
              <p className="text-gray-900">
                {selectedOrder.specialInstructions || 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      {selectedOrder.status === 'New' && (
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            disabled={cancelStatus === 'loading'}
            className={`px-6 py-3 rounded-lg font-medium ${
              cancelStatus === 'loading'
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            } transition-colors`}
          >
            {cancelStatus === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Cancelling...
              </span>
            ) : (
              'Cancel Order'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;