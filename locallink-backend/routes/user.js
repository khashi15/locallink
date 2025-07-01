const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const axios = require('axios');

// ----------- Profile Routes -----------

// GET /api/user/profile → Fetch profile from JWT + optionally SCIM
router.get('/profile', checkJwt, async (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = await axios.get(`${process.env.ASGARDEO_BASE_URL}/scim2/Me`, {
      headers: { Authorization: token },
    });

    return res.json({
      message: 'Profile fetched successfully',
      jwtUser: req.auth,
      scimProfile: response.data,
    });
  } catch (err) {
    console.error('⚠️ SCIM fetch failed:', err.response?.data || err.message);
    return res.json({
      message: 'Profile fetched from JWT only',
      jwtUser: req.auth,
    });
  }
});

// PUT /api/user/profile → Update profile via SCIM
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
    console.error('⚠️ Error updating SCIM profile:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
