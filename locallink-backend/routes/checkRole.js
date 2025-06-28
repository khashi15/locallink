const axios = require('axios');
const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/auth');

const ASGARDEO_ORG = process.env.ASGARDEO_ORG;
const ASGARDEO_BASE_URL = `https://api.asgardeo.io/t/${ASGARDEO_ORG}`;
const ADMIN_TOKEN = process.env.ADMIN_MANAGEMENT_API_TOKEN; // Stored in .env

if (!ADMIN_TOKEN) {
  console.warn('⚠️ Warning: ADMIN_MANAGEMENT_API_TOKEN not set in environment variables.');
}

// ✅ Corrected route - this is GET /api/checkrole
router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.user.sub;

    const response = await axios.get(`${ASGARDEO_BASE_URL}/scim2/Users/${userId}`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });

    // ✅ Extract groups -> roles
    const userGroups = response.data.groups || [];

    if (userGroups.length > 0) {
      const roles = userGroups.map(group => group.display);  // Extract role names
      res.json({ hasRole: true, roles });
    } else {
      res.json({ hasRole: false, roles: [] });
    }

  } catch (error) {
    console.error('❌ Error fetching roles:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

module.exports = router;