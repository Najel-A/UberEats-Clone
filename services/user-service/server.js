require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();

// Kafka configuration
const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['kafka-service:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-service-group' });

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
  await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message:', message.value.toString());
      // Handle user-related events
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
}); 