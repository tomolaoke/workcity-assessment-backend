## 🚀 Workcity Backend

This is the backend for the **Workcity Full-Stack & WordPress Developer Assessment**, built using **Node.js**, **Express**, and **MongoDB**.

### ✨ Features
- 🔐 JWT-based authentication (signup & login)
- 👤 User roles: `admin` and `user`
- 📋 Full CRUD operations for Clients and Projects
- 📂 Fetch projects by client
- 🛡 Input validation and error handling
- 🧪 Unit tests for `Create Client` and `Update Project` endpoints

---

### ⚙️ Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/workcity-assessment-backend.git
cd workcity-assessment-backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root folder with:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/workcity
JWT_SECRET=your_jwt_secret_key_here
```

#### 4. Run MongoDB
Ensure MongoDB is running locally or connect to a cloud instance like MongoDB Atlas.

#### 5. Start the Server
```bash
npm start
```

#### 6. Run Tests
```bash
npm test
```

---

### 📡 API Endpoints

#### 🔑 Auth
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login a user

#### 👥 Clients
- `GET /api/clients` — Get all clients *(admin only)*
- `POST /api/clients` — Create a new client
- `PUT /api/clients/:id` — Update client info
- `DELETE /api/clients/:id` — Delete a client *(admin only)*

#### 📁 Projects
- `GET /api/projects` — Retrieve all projects
- `GET /api/projects/client/:clientId` — Get projects by client
- `POST /api/projects` — Create a new project
- `PUT /api/projects/:id` — Update a project
- `DELETE /api/projects/:id` — Delete a project *(admin only)*

---

### 📌 Assumptions
- MongoDB is the primary database.
- JWT tokens expire after 1 hour.
- Admin users have elevated permissions for restricted endpoints.

---

### 👤 Author

ΞDΛ° T O M O L Δ |  oke  

