Workcity Assessment Backend
This is the backend for the Workcity Full-Stack & WordPress Developer Assessment, built with Node.js, Express, and MongoDB.
Features

JWT-based authentication (Signup/Login)
User roles: admin, user
CRUD operations for Clients and Projects
Fetch projects by client
Input validation and error handling
Unit tests for Create Client and Update Project endpoints

Setup Instructions

Clone the Repository:
git clone https://github.com/yourusername/workcity-assessment-backend.git
cd workcity-assessment-backend


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/workcity
JWT_SECRET=your_jwt_secret_key_here


Run MongoDB:Ensure MongoDB is running locally or use a cloud service like MongoDB Atlas.

Start the Server:
npm start


Run Tests:
npm test



API Endpoints

Auth:
POST /api/auth/signup - Register a new user
POST /api/auth/login - Login a user


Clients:
GET /api/clients - Get all clients (admin only)
POST /api/clients - Create a client
PUT /api/clients/:id - Update a client
DELETE /api/clients/:id - Delete a client (admin only)


Projects:
GET /api/projects - Get all projects
GET /api/projects/client/:clientId - Get projects by client
POST /api/projects - Create a project
PUT /api/projects/:id - Update a project
DELETE /api/projects/:id - Delete a project (admin only)



Assumptions

MongoDB is used as the database.
JWT tokens expire after 1 hour.
Admin users have additional permissions for certain operations.
