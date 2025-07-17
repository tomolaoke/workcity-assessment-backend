const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Client = require('../models/Client');
const User = require('../models/User');
const projectRoutes = require('../routes/projects');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/projects', projectRoutes);

describe('Project API', () => {
  let token, clientId, userId;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await mongoose.connection.collection('projects').deleteMany({});
    await mongoose.connection.collection('clients').deleteMany({});
    await mongoose.connection.collection('users').deleteMany({});

    const user = new User({
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'user',
    });
    await user.save();
    userId = user._id;

    token = require('jsonwebtoken').sign(
      { id: userId, role: user.role },
      process.env.JWT_SECRET
    );

    const client = new Client({
      name: 'Test Client',
      email: `client${Date.now()}@example.com`, // ✅ no email duplication
      createdBy: userId,
    });
    await client.save();
    clientId = client._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test('PUT /api/projects/:id - Update a project', async () => {
    const project = new Project({
      title: 'Test Project',
      client: clientId,
      createdBy: userId,
    });
    await project.save();

    console.log('Created project ID:', project._id); // ✅ confirm project exists

    const response = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Project',
        client: clientId,
        status: 'in-progress',
      });

~
    expect(response.body.title).toBe('Updated Project');
    expect(response.body.status).toBe('in-progress');
  });
});