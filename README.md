# Food Delivery Microservices System

This is a distributed food delivery system built using microservices architecture, Kubernetes, MongoDB, and Kafka.

## Prerequisites

- Docker Desktop
- Kubernetes (included with Docker Desktop)
- Node.js (v14 or higher)
- npm (Node Package Manager)
- kubectl (Kubernetes CLI)

## Project Structure

```
.
├── k8s/                    # Kubernetes configuration files
│   └── kafka.yaml         # Kafka and Zookeeper deployment
├── services/
│   ├── user-service/      # User management service
│   ├── restaurant-service/ # Restaurant management service
│   └── order-service/     # Order processing service
└── frontend/              # Frontend application
```

## Setup Instructions

1. **Start Docker Desktop**
   - Ensure Docker Desktop is running
   - Enable Kubernetes in Docker Desktop settings

2. **Build Service Images**
   ```powershell
   # Build all service images
   docker build -t user-service:latest services/user-service
   docker build -t restaurant-service:latest services/restaurant-service
   docker build -t order-service:latest services/order-service
   ```

3. **Create MongoDB Secret**
   ```powershell
   # Create the MongoDB secret
   kubectl create secret generic mongodb-secret --from-literal=uri="mongodb://mongodb-service:27017/orders"
   ```

4. **Deploy Services**
   ```powershell
   # Deploy Kafka and Zookeeper
   kubectl apply -f k8s/kafka.yaml

   # Wait for Kafka to be ready (about 30 seconds)
   Start-Sleep -Seconds 30

   # Deploy the microservices
   kubectl apply -f services/user-service/k8s-deployment.yaml
   kubectl apply -f services/restaurant-service/k8s-deployment.yaml
   kubectl apply -f services/order-service/k8s-deployment.yaml
   ```

5. **Verify Deployments**
   ```powershell
   # Check if all pods are running
   kubectl get pods

   # Check service status
   kubectl get svc
   ```

## Running the Application

1. **Set up Port Forwarding**
   Since we're using PowerShell, we need to run each port-forward command in a separate window. Open four separate PowerShell windows and run these commands:

   Window 1:
   ```powershell
   kubectl port-forward service/frontend-service 3000:80
   ```

   Window 2:
   ```powershell
   kubectl port-forward service/order-service 5003:5003
   ```

   Window 3:
   ```powershell
   kubectl port-forward service/restaurant-service 5002:5002
   ```

   Window 4:
   ```powershell
   kubectl port-forward service/user-service 5001:5001
   ```

2. **Access the Services**
   - Frontend: http://localhost:3000
   - User Service: http://localhost:5001
   - Restaurant Service: http://localhost:5002
   - Order Service: http://localhost:5003

## Viewing Logs

To view logs for any service, use the following commands:

1. **Get Pod Names**
   ```powershell
   kubectl get pods
   ```

2. **View Logs**
   ```powershell
   # View logs for a specific pod
   kubectl logs <pod-name>

   # Follow logs in real-time
   kubectl logs -f <pod-name>

   # View logs for all pods of a service
   kubectl logs -l app=<service-name>
   ```

   Example:
   ```powershell
   # View user service logs
   kubectl logs -f user-service-<pod-id>

   # View restaurant service logs
   kubectl logs -f restaurant-service-<pod-id>

   # View order service logs
   kubectl logs -f order-service-<pod-id>
   ```

## Troubleshooting

1. **If services fail to start:**
   ```powershell
   # Check pod status
   kubectl get pods

   # Check pod logs
   kubectl logs <pod-name>

   # Restart deployments if needed
   kubectl rollout restart deployment order-service restaurant-service user-service
   ```

2. **If port forwarding fails:**
   - Ensure no other service is using the same port
   - Kill any existing port-forward processes
   - Try using a different local port

3. **If Kafka connection fails:**
   - Check Kafka pod status: `kubectl get pods -l app=kafka`
   - Check Kafka logs: `kubectl logs -l app=kafka`
   - Ensure Zookeeper is running: `kubectl get pods -l app=zookeeper`

## Architecture Overview

The system uses:
- **Microservices**: User, Restaurant, and Order services
- **Kafka**: For event-driven communication between services
- **MongoDB**: For data persistence
- **Kubernetes**: For container orchestration

## Cleanup

To clean up the deployment:
```powershell
kubectl delete -f k8s/kafka.yaml
kubectl delete -f services/user-service/k8s-deployment.yaml
kubectl delete -f services/restaurant-service/k8s-deployment.yaml
kubectl delete -f services/order-service/k8s-deployment.yaml
kubectl delete secret mongodb-secret
```

## Checking Kubernetes Deployments

1. **View All Resources**
   ```powershell
   # View all resources (pods, services, deployments)
   kubectl get all
   ```

2. **Check Specific Resources**
   ```powershell
   # View all pods
   kubectl get pods

   # View all services
   kubectl get services

   # View all deployments
   kubectl get deployments
   ```

3. **Check Resource Details**
   ```powershell
   # Get detailed information about a pod
   kubectl describe pod <pod-name>

   # Get detailed information about a service
   kubectl describe service <service-name>

   # Get detailed information about a deployment
   kubectl describe deployment <deployment-name>
   ```

4. **Check Resource Logs**
   ```powershell
   # View logs for a specific pod
   kubectl logs <pod-name>

   # Follow logs in real-time
   kubectl logs -f <pod-name>

   # View logs for all pods of a service
   kubectl logs -l app=<service-name>
   ```

5. **Check Resource Status**
   ```powershell
   # Check pod status
   kubectl get pods -o wide

   # Check service endpoints
   kubectl get endpoints

   # Check deployment status
   kubectl rollout status deployment/<deployment-name>
   ```

6. **Check Resource Events**
   ```powershell
   # View all events in the cluster
   kubectl get events

   # View events for a specific namespace
   kubectl get events -n <namespace>
   ```

7. **Check Resource Configuration**
   ```powershell
   # View deployment configuration
   kubectl get deployment <deployment-name> -o yaml

   # View service configuration
   kubectl get service <service-name> -o yaml

   # View pod configuration
   kubectl get pod <pod-name> -o yaml
   ```
