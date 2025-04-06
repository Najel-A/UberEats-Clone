import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, notification, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import OrderCard from '../../components/Order/OrderCard';
import { fetchRestaurantOrders, updateOrderStatus } from '../../../../redux/slices/orderSlice';

const RestaurantOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Correct selector - using restaurantOrders instead of orders
  const { 
    restaurantOrders, 
    restaurantOrdersStatus, 
    restaurantOrdersError,
    statusUpdateStatus 
  } = useSelector((state) => state.order);
  
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchRestaurantOrders());
    }
  }, [dispatch, token]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, newStatus }))
      .unwrap()
      .catch((error) => {
        notification.error({
          message: 'Update Failed',
          description: error || 'Failed to update order status'
        });
      });
  };

  if (restaurantOrdersError) {
    return <div>Error: {restaurantOrdersError}</div>;
  }

  if (restaurantOrdersStatus === 'loading') {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Restaurant Orders</h1>
        <Button 
          type="primary" 
          onClick={() => navigate('/restaurant/home')}
          style={{
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '40px',
            padding: '0 20px'
          }}
        >
          Back to Dashboard
        </Button>
      </div>
      {restaurantOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        restaurantOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onStatusChange={handleStatusChange}
            isRestaurant={true}
            isUpdating={statusUpdateStatus === 'loading'}
          />
        ))
      )}
    </div>
  );
};

export default RestaurantOrders;