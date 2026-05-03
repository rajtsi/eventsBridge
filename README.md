# 🚀 EventBridge – Event-Driven Delivery System

A full-stack event-driven system that captures events, routes them to subscribed services, and ensures reliable delivery with retries and Dead Letter Queue (DLQ) handling.

---

## 🧠 Overview

EventBridge simulates how modern distributed systems handle events reliably.

* Producers send events
* Services subscribe to event types
* Events are delivered asynchronously
* Failures are retried automatically
* Permanent failures go to a DLQ for manual recovery

---

## ✨ Features

### 🔹 Event Processing

* Create and store events with dynamic payload validation
* Support for multiple event types with configurable schemas

### 🔹 Subscription System

* Services can subscribe to specific event types
* Multiple services can listen to the same event

### 🔹 Delivery Engine

* Asynchronous processing using queue (BullMQ)
* Retry mechanism with exponential backoff
* Idempotency support

### 🔹 Dead Letter Queue (DLQ)

* Failed jobs are moved to DLQ after max retries
* Manual retry support from UI

### 🔹 Observability Dashboard

* Real-time stats (events, success, failures)
* Event listing with pagination
* Delivery tracking
* Failed jobs (DLQ) management

---

## 🏗️ Architecture

```
Frontend (React)
        ↓
Backend API (Node.js)
        ↓
PostgreSQL (Events, Services, Subscriptions)
        ↓
Redis (Queue)
        ↓
Worker (BullMQ)
        ↓
Webhook Delivery
```

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TailwindCSS
* **Backend:** Node.js, Express
* **Queue:** BullMQ (Redis)
* **Database:** PostgreSQL (Sequelize ORM)
* **Other:** Axios, AsyncLocalStorage (trace tracking)

---

## ⚙️ Local Setup

### 1. Clone repo

```bash
git clone <your-repo-url>
cd eventbridge
```

---

### 2. Setup environment

Create `.env.development`:

```env
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=eventbridge_dev
DB_USER=rajatsingh
DB_PASSWORD=password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

CLIENT_ID=companyA
```

---

### 3. Create database

```bash
psql -U rajatsingh -d postgres
```

```sql
CREATE DATABASE eventbridge_dev;
```

---

### 4. Start system

```bash
./start.sh
```

This will:

* run migrations
* start backend
* start worker
* run setup script
* start frontend

---

### 5. Manual step (Webhook Clients)

Run this in DB:

```sql
INSERT INTO "WebhookClients" ("clientId", "service", "secret", "createdAt", "updatedAt")
VALUES
('companyA', 'payment', 'payment-secret', NOW(), NOW()),
('companyA', 'email', 'email-secret', NOW(), NOW()),
('companyA', 'analytics', 'analytics-secret', NOW(), NOW()),
('companyA', 'notification', 'notification-secret', NOW(), NOW());
```

---

## 🧪 How to Use

1. Open frontend → `http://localhost:5173`
2. Create an event
3. Watch:

   * Deliveries created
   * Worker processing
   * Failures → DLQ
4. Retry failed jobs from UI

---

## 🔁 Failure Handling Flow

```
Event Created
    ↓
Delivery Attempt
    ↓
Fail → Retry (3 times)
    ↓
Still fails → DLQ
    ↓
Manual Retry → Success
```

---

## 📊 Key Learnings

* Event-driven architecture design
* Reliable delivery patterns (retry + DLQ)
* Queue-based asynchronous processing
* System observability & debugging
* Separation of concerns (API vs worker)

---

## 🚀 Future Improvements

* Authentication & multi-tenant clients
* Rate limiting per client
* Webhook signature verification UI
* Metrics dashboard (Prometheus/Grafana)
* Deployment (Railway + Vercel)

---

## 📸 Screenshots


> * Dashboard
<img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/cd9849fd-6890-41fb-8502-7af6ddf3a823" />


> * Event creation
    <img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/193cb44c-d794-4fe9-ae5f-5837545ea5c3" />

>   <img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/1ff30a42-6f5a-48ec-9daf-0456f9138e2a" />

>   <img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/4a700fb0-b14b-4ef3-895b-04dbc5115957" />


> * Events List
   <img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/7bc07872-4230-46fa-9f39-24cb4e161894" />


> * Deliveries List
     <img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/3138b5cd-1f3d-4e53-a8d9-621fa5449caa" />


> * Failed Jobs With Retry button
   <img width="2940" height="1846" alt="image" src="https://github.com/user-attachments/assets/490291d2-f4b9-4e70-9e1f-5f51acdda5f3" />


---

## 👨‍💻 Author

Rajat Singh

---

## ⭐ If you found this useful, consider starring the repo!
