const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Get all personas
router.get('/', auth, async (req, res) => {
  try {
    const personas = await prisma.persona.findMany({
      where: { userId: req.user.id },
      include: { sites: true }
    });
    res.json(personas);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch personas' });
  }
});

// Create persona
router.post('/', auth, async (req, res) => {
  try {
    const persona = await prisma.persona.create({
      data: {
        ...req.body,
        userId: req.user.id
      }
    });
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create persona' });
  }
});

// Update persona
router.put('/:id', auth, async (req, res) => {
  try {
    const persona = await prisma.persona.update({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      data: req.body
    });
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update persona' });
  }
});

// Delete persona
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.persona.delete({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    res.json({ message: 'Persona deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete persona' });
  }
});

module.exports = router;