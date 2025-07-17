const express = require('express');
const { check, validationResult } = require('express-validator');
const Client = require('../models/Client');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

// Validation middleware for client
const clientValidation = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please provide a valid email').isEmail(),
];

// GET /api/clients - Get all clients (admin only)
router.get('/', [auth, admin], async (req, res, next) => {
  try {
    const clients = await Client.find().populate('createdBy', 'email');
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

// POST /api/clients - Create a new client
router.post('/', [auth, clientValidation], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone } = req.body;

  try {
    const client = new Client({
      name,
      email,
      phone,
      createdBy: req.user.id,
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
});

// PUT /api/clients/:id - Update a client
router.put('/:id', [auth, clientValidation], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone } = req.body;

  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    client.name = name;
    client.email = email;
    client.phone = phone || client.phone;

    await client.save();
    res.json(client);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/clients/:id - Delete a client (admin only)
router.delete('/:id', [auth, admin], async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.remove();
    res.json({ message: 'Client deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;