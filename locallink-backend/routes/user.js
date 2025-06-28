const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/auth');
const axios = require('axios');

// GET /api/user/profile
// Return user profile info from JWT plus optionally Asgardeo SCIM /Me info
router.get('/profile', checkJwt, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: no user info found' });
  }

  const token = req.headers.authorization;
  try {
    // Optionally fetch extended profile from Asgardeo SCIM API
    const response = await axios.get(`${process.env.ASGARDEO_BASE_URL}/scim2/Me`, {
      headers: { Authorization: token }
    });

    return res.json({
      message: 'Profile fetched successfully',
      jwtUser: req.user,
      scimProfile: response.data,
    });
  } catch (err) {
    // If SCIM call fails, fallback to just JWT info
    console.error('Error fetching SCIM profile:', err.response?.data || err.message);
    return res.json({
      message: 'Profile fetched from JWT only',
      jwtUser: req.user,
    });
  }
});

// PUT /api/user/profile
// Update profile via SCIM API
router.put('/profile', checkJwt, async (req, res) => {
  const token = req.headers.authorization;
  const { givenName, familyName, phoneNumbers, profileUrl } = req.body;

  try {
    const response = await axios.patch(
      `${process.env.ASGARDEO_BASE_URL}/scim2/Me`,
      {
        name: {
          givenName,
          familyName,
        },
        phoneNumbers,
        profileUrl,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res.json({
      message: 'Profile updated successfully',
      updatedProfile: response.data,
    });
  } catch (err) {
    console.error('Error updating profile:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;