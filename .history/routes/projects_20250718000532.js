const express = require('express');
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

// Validation middleware for project
const projectValidation = [
  check('title', 'Title is required').notEmpty(),
  check('client', 'Client ID is required').isMongoId(),
  check('status', 'Invalid status').optional().isIn(['pending', 'in-progress', 'completed']),
];

// GET all projects
router.get('/', auth, async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name email')
      .populate('createdBy', 'email');
    res.json(projects);
  } catch (error) {
    console.error('🔥 Error fetching projects:', error);
    next(error);
  }
});

// GET projects by client
router.get('/client/:clientId', auth, async (req, res, next) => {
  try {
    const projects = await Project.find({ client: req.params.clientId })
      .populate('client', 'name email')
      .populate('createdBy', 'email');
    res.json(projects);
  } catch (error) {
    console.error('🔥 Error fetching client projects:', error);
    next(error);
  }
});

// CREATE new project
router.post('/', [auth, projectValidation], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, client, status, deadline } = req.body;

  try {
    const project = new Project({
      title,
      description,
      client,
      status,
      deadline,
      createdBy: req.user.id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('🔥 Error creating project:', error); // 👈 NEW
    res.status(500).json({ error: error.message });
  }
});

// UPDATE existing project
router.put('/:id', [auth, projectValidation], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, client, status, deadline } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.title = title;
    project.description = description || project.description;
    project.client = client;
    project.status = status || project.status;
    project.deadline = deadline || project.deadline;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('🔥 Error updating project:', error); // 👈 NEW
    res.status(500).json({ error: error.message });
  }
});

// DELETE project (admin only)
router.delete('/:id', [auth, admin], async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('🔥 Error deleting project:', error);
    next(error);
  }
});

module.exports = router;