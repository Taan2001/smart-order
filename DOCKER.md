# 🚀 Deploy Smart Order by Docker

## 📂 Project Structure

```
smart_order/
├─ back-end/
│ └─ ...
├─ front-end/
│ └─ ...
├─ docker/
│ ├─ back-end/
│ │ └─ Dockerfile
│ ├─ front-end/
│ │ └─ Dockerfile
│ ├─ mysql/
│ │ └─ 01-database-script.sql
│ │ └─ 02-data-dumy.sql
│ └─ docker-compose.yml
├─ .dockerignore
└─ DOCKER.md
```

## 1. Prerequisites

- Docker >= 20
- Docker Compose v2

### Verify installation:

```bash
docker -v
docker compose version
```

## 2. Deploy with docker

If you haven't made any configuration changes to the source code, we'll proceed to build and run the source on Docker.

### 2.1 Build and Start Services

```bash
cd docker
docker-compose up -d --build
```

### 2.2 Check Running Containers

```bash
docker-compose ps
```

### 2.3 View log in Containers

```bash
docker logs <service-name>
docker logs smart-order-database
docker logs smart-order-backend
```

### 2.4 Access Services

#### Back end

```bash
http://localhost:3000
```

#### Front end

```bash
http://localhost:8080
```

#### MySQL (from host machine):

```bash
Host: localhost
Port: 3307
```

### 2.5 Connect to MySQL via CLI

```bash
mysql -h localhost -P 3307 -u smart_order_user -p
```

### 2.6 Stop services

```bash
docker compose down
```

### 2.7 Reset Database (Remove All Data)

```bash
docker compose down
docker volume rm smart_order_data
docker compose up -d
```

### 2.8 Rebuild Backend After Code Changes

```bash
docker compose up -d --build smart_order_backend
```
