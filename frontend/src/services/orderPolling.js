// src/services/orderPolling.js
let pollingInterval;

export const startOrderPolling = (dispatch, getState, interval = 10000) => {
  // Clear existing interval if any
  if (pollingInterval) clearInterval(pollingInterval);
  
  // Immediate first fetch
  dispatch(fetchCustomerOrders(getState().auth.user.id));
  
  // Set up interval
  pollingInterval = setInterval(() => {
    const { lastUpdated } = getState().orders;
    // Only poll if last update was more than 30 seconds ago
    if (!lastUpdated || Date.now() - lastUpdated > 30000) {
      dispatch(fetchCustomerOrders(getState().auth.user.id));
    }
  }, interval);
};

export const stopOrderPolling = () => {
  if (pollingInterval) clearInterval(pollingInterval);
};