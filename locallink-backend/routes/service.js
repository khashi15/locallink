const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { checkJwt, authorizeRoles, attachUser } = require('../middleware/auth');

// ----------------------
// ✅ Get all services (any logged-in user)
router.get('/', checkJwt, attachUser, async (req, res) => {
  try {
    const db = getDB();
    const services = await db.collection('services').find().toArray();
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// ✅ Get services owned by the logged-in service provider
router.get('/my', checkJwt, attachUser, authorizeRoles('service_provider'), async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.sub;
    const services = await db
      .collection('services')
      .find({ provider_user_id: userId })
      .toArray();
    res.json(services);
  } catch (err) {
    console.error('Error fetching user services:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// ✅ Create a new service (service providers only)
router.post('/', checkJwt, attachUser, authorizeRoles('service_provider'), async (req, res) => {
  try {
    const db = getDB();
    const { title, description } = req.body;
    const userId = req.user.sub;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newService = {
      id: Date.now().toString(),
      title,
      description,
      provider_user_id: userId,
    };

    await db.collection('services').insertOne(newService);
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// ✅ Update own service by ID (service providers only)
router.put('/:id', checkJwt, attachUser, authorizeRoles('service_provider'), async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.sub;

    const service = await db.collection('services').findOne({ id });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider_user_id !== userId) {
      return res.status(403).json({ message: 'You can only edit your own services' });
    }

    await db.collection('services').updateOne(
      { id },
      { $set: { title, description } }
    );

    const updatedService = await db.collection('services').findOne({ id });
    res.json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------
// ✅ Delete own service by ID (service providers only)
router.delete('/:id', checkJwt, attachUser, authorizeRoles('service_provider'), async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const userId = req.user.sub;

    const service = await db.collection('services').findOne({ id });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider_user_id !== userId) {
      return res.status(403).json({ message: 'You can only delete your own services' });
    }

    await db.collection('services').deleteOne({ id });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;