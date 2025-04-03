// pages/OrderHistoryPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerOrders } from '../../../../redux/slices/orderSlice';
import OrderCard from '../../components/Order/OrderCard';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderHistory, historyStatus, error } = useSelector((state) => state.order);
  //console.log('Redux Order State:', { orderHistory, historyStatus, error });

  useEffect(() => {
    dispatch(getCustomerOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center"
        >
          <span>← Back</span>
        </button>
      </div>
      
      {historyStatus === 'loading' && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {historyStatus === 'failed' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading orders: {error}</p>
          <button
            onClick={() => dispatch(getCustomerOrders())}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {historyStatus === 'succeeded' && (
        <div>
          {orderHistory.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;