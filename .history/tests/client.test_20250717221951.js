const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const clientRoutes = require('../routes/clients');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);

describe('Client API', () => {
  let token;

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
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test('POST /api/clients - Create a client', async () => {
    const response = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Client',
        email: 'client@example.com',
        phone: '1234567890',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Test Client');
  });
});