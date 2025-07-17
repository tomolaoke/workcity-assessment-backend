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
  let token, clientId;

  beforeAll(async () => {
    await connectDB();
    // Create a test user
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });
    await user.save();
    token = require('jsonwebtoken').sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    // Create a test client
    const client = new Client({
      name: 'Test Client',
      email: 'client@example.com',
      createdBy: user._id,
    });
    await client.save();
    clientId = client._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test('PUT /api/projects/:id - Update a project', async () => {
    // Create a test project
    const project = new Project({
      title: 'Test Project',
      client: clientId,
      createdBy: (await User.findOne({ email: 'test@example.com' }))._id,
    });
    await project.save();

    const response = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Project',
        client: clientId,
        status: 'in-progress',
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Project');
    expect(response.body.status).toBe('in-progress');
  });
});