const express = require('express');
const router = express.Router();
const axios = require('axios');
const { checkJwt, authorizeRoles } = require('../middleware/auth');

// ------------------ ✅ Fetch Users from Asgardeo ------------------
router.get('/asgardeo-users', checkJwt, authorizeRoles('admin'), async (req, res) => {
  try {
    // 🔐 Get Management Access Token
    const tokenResponse = await axios.post(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'internal_user_mgt_list internal_user_mgt_view urn:ietf:params:scim:api:messages:2.0:Users',
      }),
      {
        auth: {
          username: process.env.ASGARDEO_ADMIN_CLIENT_ID,
          password: process.env.ASGARDEO_ADMIN_CLIENT_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 🔗 Call SCIM API to fetch users
    const usersResponse = await axios.get(
      `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/scim2/Users`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const users = usersResponse.data.Resources.map((user) => ({
      id: user.id || '', 
      username: user.userName || '',
      email: (Array.isArray(user.emails) && user.emails.length > 0) ? user.emails[0] : '',
      firstName: user.name?.givenName || '',
      lastName: user.name?.familyName || '',
      roles: user.roles?.map((r) => r.display) || [],
      phone:
        Array.isArray(user.phoneNumbers) && user.phoneNumbers.length > 0
          ? user.phoneNumbers[0].value
          : '',
      country: user['urn:scim:wso2:schema']?.country || '',
    }));

    res.json(users);
  } catch (err) {
    console.error(
      '❌ Error fetching users from Asgardeo:',
      err.response?.data || err.message
    );
    res.status(500).json({ message: 'Failed to fetch users from Asgardeo' });
  }
});

// ------------------ ✅ Fetch Users from MongoDB ------------------
router.get('/users', checkJwt, authorizeRoles('admin'), async (req, res) => {
  const db = req.app.locals.db;
  if (!db) return res.status(500).json({ message: 'Database not connected' });

  try {
    const profiles = await db.collection('userProfiles').find({}).toArray();

    const users = profiles.map((u) => ({
      userId: u.userId || '',
      username: u.email || '',
      email: u.email || '',
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      roles: Array.isArray(u.role) ? u.role : [u.role],
      phone: u.contactNumber || '',
      country: u.country || '',
    }));

    res.json(users);
  } catch (err) {
    console.error('❌ MongoDB fetch error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;