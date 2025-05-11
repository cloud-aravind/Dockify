# 🚀 Dockify – Containerized Full-Stack App Deployed on AWS

**Dockify** is a full-stack web application built with Node.js, Express, HTML, and MongoDB — fully containerized using Docker and deployed to AWS using ECS Fargate (backend) and EC2 (MongoDB).

---

## 📦 Tech Stack

- **Frontend**: HTML, served via Express backend
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongo Express UI)
- **Containerization**: Docker, Docker Compose
- **Cloud Deployment**:
  - ECS Fargate (MyApp)
  - EC2 (MongoDB + Mongo Express)
  - ECR (Docker Image Registry)
  - CloudWatch (Logging)

---

## 🛠️ Features

- 🔧 Multi-stage Dockerfile for optimized image builds
- 🐳 Docker Compose for local orchestration
- 📬 Form submission writes to MongoDB collection
- 📊 Mongo Express for data visualization
- 🌐 ECS-deployed container with dynamic API routing (`window.location.origin`)
- 🔒 MongoDB secured with `authSource=admin`
- 📈 Real-time ECS logging using CloudWatch

---

## 🧭 Architecture

```
Browser
  ↓
[ECS Public IP]
  ↓
MyApp Container (Node.js)
  ↓
MongoDB Container (EC2)
  ↳ Mongo Express (EC2:8081)
```

---

## ⚙️ Project Setup

### 1. Local Development (Docker Compose)

```bash
docker-compose up --build
```

### 2. Docker Image Build & Push

```bash
docker build -t myapp:1.2 .
docker tag myapp:1.2 <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com/myapp:1.2
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com/myapp:1.2
```

---

## ☁️ AWS Deployment Summary

### 🧱 MongoDB & Mongo Express on EC2
- Deployed as Docker containers
- Verified Mongo Express UI on `http://<EC2_PUBLIC_IP>:8081`
- Created DB: `AccountDetails`, Collection: `users`

### 🚀 ECS Fargate for MyApp
- Deployed container using pushed ECR image
- Set environment variable:
  ```
  MONGO_URL=mongodb://admin:password@<EC2_PRIVATE_IP>:27017/admin?authSource=admin
  ```
- Enabled public IP for testing
- Verified full form flow from ECS to EC2 MongoDB

---

## 🐞 Troubleshooting Log

| Issue | Fix |
|-------|-----|
| `CREATE_FAILED: Unable to assume service-linked role` | Manually created ECS IAM role |
| `Image not found` | Retagged and re-pushed to ECR with correct tag |
| `500 Internal Server Error` on `/submit` | Fixed DB connection handling, added `if (!db)` |
| `MongoRuntimeError: Unable to parse <EC2_PRIVATE_IP>` | Replaced placeholder with real IP in ECS Task Definition |
| MongoDB connection failed | Opened port 27017 in EC2 Security Group and ensured ECS subnet access |
| DB insert failed | Added fallback logging and graceful error handling in `server.js` |

---

## ✅ Final Result

- MyApp served at ECS Public IP
- Form submission writes to MongoDB on EC2
- Mongo Express verifies insertions
- Logs confirm:
  ```
  ✅ Connected to MongoDB
  🚀 Server running on port 3000
  ```

---

## 📂 Repository Structure

```
.
├── server.js               # Node.js backend
├── index.html              # Frontend
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Local dev setup
└── README.md               # Project summary
```

---

## 🧠 Lessons Learned

- Deep understanding of Docker image flow and ECS Task behavior
- Real-world debugging: IAM roles, image tags, MongoDB auth
- Environment variable propagation in cloud deployments
- Using CloudWatch to trace app logs for live troubleshooting

---

## ✨ Credits

This project was built as part of a personal DevOps learning journey. Every step — including failures, logs, CLI commands, and fixes — was documented, tested, and validated manually.

