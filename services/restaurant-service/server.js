require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();

// Kafka configuration
const kafka = new Kafka({
  clientId: 'restaurant-service',
  brokers: ['kafka-service:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'restaurant-service-group' });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Kafka consumer setup
async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received order event:', message.value.toString());
      // Handle order-related events
      const orderData = JSON.parse(message.value.toString());
      
      // Process order status updates
      if (orderData.type === 'ORDER_CREATED') {
        // Update restaurant's order status
        console.log('Processing new order:', orderData);
      }
    },
  });
}

// Start Kafka consumer
startKafkaConsumer().catch(console.error);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
}); 