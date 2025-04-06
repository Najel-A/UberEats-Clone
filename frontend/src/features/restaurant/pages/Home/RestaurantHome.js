import React, { useEffect } from 'react';
import { Spin, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import OrderCard from '../../components/Order/OrderCard';
import { fetchRestaurantOrders, updateOrderStatus } from '../../../../redux/slices/orderSlice';

const RestaurantHome = () => {
  const dispatch = useDispatch();
  
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
      <h1>Restaurant Orders</h1>
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

export default RestaurantHome;