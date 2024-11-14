const express = require('express');
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Get all sites
router.get('/', verifyToken, async (req, res) => {
  try {
    const sitesRef = db.collection('sites');
    const snapshot = await sitesRef.where('userId', '==', req.user.uid).get();
    
    const sites = [];
    snapshot.forEach(doc => {
      sites.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create site
router.post('/', verifyToken, async (req, res) => {
  try {
    const siteData = {
      ...req.body,
      userId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('sites').add(siteData);
    res.json({ id: docRef.id, ...siteData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update site
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const siteRef = db.collection('sites').doc(req.params.id);
    const site = await siteRef.get();

    if (!site.exists) {
      return res.status(404).json({ error: 'Site not found' });
    }

    if (site.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await siteRef.update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete site
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const siteRef = db.collection('sites').doc(req.params.id);
    const site = await siteRef.get();

    if (!site.exists) {
      return res.status(404).json({ error: 'Site not found' });
    }

    if (site.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await siteRef.delete();
    res.json({ message: 'Site deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;