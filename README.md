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
├── backend/
├── frontend/
├── jmeter-tests/
|── docker-compose.yml               
├── k8s/                    # Kubernetes configuration files
│   └── kafka
|   |   |── deployment.yaml     
|   |─── backend
|   |   |── deployment.yaml
|   |   |── service.yaml   
|   |─── frontend
|   |   |── deployment.yaml
|   |   |── service.yaml
|   |─── mongodb
|   |   |── deployment.yaml
|   |── ingress.yaml
```

## Setup Instructions

1. **Start Docker Desktop**
   - Ensure Docker Desktop is running
   - Enable Kubernetes in Docker Desktop settings

2. **Build Dockerfile**
   ```powershell
   # Build docker container
   docker-compose build
   ```
3. **Deploy Services**
   ```powershell
   # Deploy Kafka, MongoDB, Frontend, and Backend
   kubectl apply -f k8s/mongodb/
   kubectl apply -f k8s/kafka/
   kubectl apply -f k8s/backend/
   kubectl apply -f k8s/frontend/
   kubectl apply -f k8s/ingress.yaml
   ```

4. **Verify Deployments**
   ```powershell
   # Check if all pods are running
   kubectl get pods

   # Check service status
   kubectl get svc
   ```

## Running the Application

1. **Set up Port Forwarding**
   ```powershell
   Access the frontend service at httpp://localhost:3000

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

## Running JMeter Tests

1. **Download Apache JMeter**
   - Visit the [Apache JMeter download page](https://jmeter.apache.org/download_jmeter.cgi).
   - Download the latest version of JMeter for your operating system.
   - Extract the downloaded archive to a preferred location.

2. **Open JMeter**
   - Navigate to the extracted JMeter folder.
   - Launch JMeter using the command:
     ```bash
     ./bin/jmeter
     ```

3. **Load the Test Plan**
   - Open the file `jmeter-tests/testing.jmx` in JMeter.
   - Note: You can also run the other `.jmx` files available in the `jmeter-tests` folder.

4. **Warnings for Specific Test Files**
   - **signup-test.jmx**: Running this test multiple times may result in a key error due to duplicate entries. Ensure the customers database is cleared before re-running.
   - **login-test.jmx**: This test only works after users are created by running `signup-test.jmx`.
   - **orders-test.jmx**: The Authorization token in the HTTP Header Manager must be updated with a valid and up-to-date token before running.

5. **Configure Test Parameters**
   - Update the server domain, port, or other parameters in the test plan if necessary.

6. **Run the Tests**
   - Click the green "Start" button in JMeter to execute the tests.

7. **View Results**
   - Check the "View Results Tree," "Summary Report," or "Aggregate Report" listeners for test results.

8. **Export Results**
   - To save the results, configure the output file in the listener settings or export manually after the test run.
