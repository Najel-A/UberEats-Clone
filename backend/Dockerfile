FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Environment variables
ENV PORT=5000 \
    NODE_ENV=production \
    MONGODB_URI=mongodb://mongodb:27017/uber-eats \
    KAFKA_BROKERS=kafka:9092

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 5000

CMD ["node", "server.js"]