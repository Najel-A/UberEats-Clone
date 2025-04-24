const { consumer } = require('../kafka/kafka');
const Order = require('../models/Order');

const startOrderEventConsumers = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log('Processing order event:', event.eventType);

        switch (event.eventType) {
          case 'ORDER_CREATED':
            // Notify restaurant, send confirmation to customer, etc.
            console.log(`New order created: ${event.orderId}`);
            break;
            
          case 'ORDER_STATUS_UPDATED':
            // Notify customer about status change
            console.log(`Order ${event.orderId} status changed from ${event.previousStatus} to ${event.status}`);
            break;
            
          case 'ORDER_CANCELLED':
            // Handle cancellation logic
            console.log(`Order ${event.orderId} was cancelled`);
            break;
        }
      } catch (error) {
        console.error('Error processing order event:', error);
      }
    },
  });
};

module.exports = startOrderEventConsumers;