require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();

// Kafka configuration
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka-service:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'order-service-group' });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Kafka producer setup
async function startKafkaProducer() {
  await producer.connect();
}

// Kafka consumer setup
async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-status-updates', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received status update:', message.value.toString());
      // Handle order status updates
    },
  });
}

// Start Kafka
startKafkaProducer().catch(console.error);
startKafkaConsumer().catch(console.error);

// Example order creation endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Save order to database
    // const order = await Order.create(orderData);
    
    // Publish order creation event
    await producer.send({
      topic: 'order-events',
      messages: [
        { 
          value: JSON.stringify({
            type: 'ORDER_CREATED',
            data: orderData
          })
        }
      ]
    });

    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
}); 