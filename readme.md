# 💸 Splitwise Clone

A full-stack expense splitting application with AI chatbot support built using **FastAPI** (backend) and **React** (frontend).

---

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup and Run](#setup-and-run)
- [API Documentation](#api-documentation)


---

## 🚀 Project Overview

This project is a simplified version of **Splitwise**, designed to:
- Manage groups and users
- Split expenses (equally or by percentage)
- Track who owes whom
- View personal balances
- Query expenses using a chatbot (optional)

---

## ✨ Features

### 🧑‍🤝‍🧑 Group & User Management
- Create groups with multiple users
- Fetch group details, members, and total expenses

### 💸 Expense Splitting
- Add expenses to groups
- Support both **equal** and **percentage-based** splits

### 🧾 Balance Tracking
- See who owes whom in a group
- View a user's balances across groups

---

## 🛠 Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| Backend   | FastAPI, Python 3.12, PostgreSQL, SQLAlchemy |
| Frontend  | React, Vite, TailwindCSS  |
| DevOps    | Docker, Docker Compose    |

---

## ✅ Prerequisites

- [Docker](https://www.docker.com/) installed and running
- (Optional) Node.js and Python if running without Docker

---

## ⚙️ Setup and Run

### Clone the repository
```bash
git clone https://github.com/your-username/splitwise-clone.git
cd splitwise-clone
```

 ## ⚙️ Setup and Run ### 
 ▶️ Run using Docker 
 ``` docker-compose up --build ```
  #### 🔗 Backend will be available at: ``` http://localhost:8000 ``` 
  #### 🔗 Frontend will be available at: ``` http://localhost:5173 ``` 
  ### ⏹ Stop the services ``` docker-compose down ``` 
  --- 
  ### ⚡ Run Manually Without Docker (Optional) 
  **Terminal 1 (Backend)** 
  ``` cd backend uvicorn app.main:app --reload ``` 
  ---
  **Terminal 2 (Frontend)** 
  ``` cd frontend npm install && npm run dev ``` 
  --- 
  ## 📡 API Documentation 
  | Endpoint | Method | Description |
   |----------------------------------|--------|--------------------------------------------| 
   | `/users` | GET | Get list of all users | 
   | `/groups` | POST | Create a new group with users | 
   | `/groups/{group_id}` | GET | Get group details | 
   | `/groups/{group_id}/expenses` | POST | Add a new expense | 
   | `/groups/{group_id}/balances` | GET | See who owes whom in the group | 
   | `/users/{user_id}/balances` | GET | View a user’s balances across groups | 
   | `/query` | POST | (Optional) Ask questions using the chatbot |
   
 📖 For full API docs, visit: `http://localhost:8000/docs` 