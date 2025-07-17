const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const User = require('../models/User');
const clientRoutes = require('../routes/clients');
const connectDB = require('../config/db');
const { auth } = require('../middleware/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ Apply real auth middleware
app.use('/api/clients', auth, clientRoutes);

describe('Client API', () => {
  let token;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('clients').deleteMany({});

    const user = new User({
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'user',
    });
    await user.save();

    token = require('jsonwebtoken').sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
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

    console.log('TEST RESPONSE:', response.body); // Helpful for debugging
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Test Client');
  });
});