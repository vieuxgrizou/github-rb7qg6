const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const sitesRoutes = require('./sites');
const personasRoutes = require('./personas');

router.use('/auth', authRoutes);
router.use('/sites', sitesRoutes);
router.use('/personas', personasRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;