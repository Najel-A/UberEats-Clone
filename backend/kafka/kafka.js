const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'order-service-group' });

module.exports = { producer, consumer, kafka };