const express = require('express');
const router = express.Router();
const axios = require('axios');
const { checkJwt } = require('../middleware/auth');
require('dotenv').config();

const ASGARDEO_ORG = process.env.ASGARDEO_ORG;
const CLIENT_ID = process.env.CLIENT_ID || process.env.ASGARDEO_ADMIN_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET || process.env.ASGARDEO_ADMIN_CLIENT_SECRET;

if (!ASGARDEO_ORG || !CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing required environment variables: ASGARDEO_ORG, CLIENT_ID, CLIENT_SECRET');
  process.exit(1);
}

const SCIM_BASE_URL = `https://api.asgardeo.io/t/${ASGARDEO_ORG}/scim2/Users`;

// Get Management API Access Token
async function getAccessToken() {
  try {
    const tokenResponse = await axios.post(
      `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'internal_user_mgt_view internal_user_mgt_update internal_user_mgt_list',
      }),
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('❌ Failed to get SCIM API token:', error.response?.data || error.message);
    throw error;
  }
}

// GET /api/profile - Fetch user profile
router.get('/profile', checkJwt, async (req, res) => {
  try {
    const userEmail = req.auth.email;
    if (!userEmail) return res.status(400).json({ message: 'No email found in token' });

    const token = await getAccessToken();

    const url = `${SCIM_BASE_URL}?filter=userName eq "DEFAULT/${userEmail}"`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    const user = response.data.Resources?.[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const phoneNumber = user.phoneNumbers?.find(p => p.type === 'mobile')?.value || '';

    res.json({
      id: user.id,
      username: user.userName,
      email: user.emails?.[0]?.value || userEmail,
      firstName: user.name?.givenName || '',
      lastName: user.name?.familyName || '',
      contactNumber: phoneNumber,
      country: user.addresses?.[0]?.country || '',
      birthDate: user['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User']?.birthDate || '',
    });
  } catch (error) {
    console.error('❌ Error fetching profile:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// POST /api/profile/update - Update user profile
router.post('/profile/update', checkJwt, async (req, res) => {
  try {
    const userEmail = req.auth.email;
    if (!userEmail) return res.status(400).json({ message: 'No email found in token' });

    const { firstName, lastName, contactNumber } = req.body;
    if (!firstName && !lastName && !contactNumber)
      return res.status(400).json({ message: 'No profile fields to update' });

    const token = await getAccessToken();

    // Fetch SCIM user ID by email
    const userRes = await axios.get(`${SCIM_BASE_URL}?filter=userName eq "DEFAULT/${userEmail}"`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    const user = userRes.data.Resources?.[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userId = user.id;

    const value = {};
    if (firstName || lastName) {
      value.name = {};
      if (firstName) value.name.givenName = firstName;
      if (lastName) value.name.familyName = lastName;
    }
    if (contactNumber) {
      value.phoneNumbers = [{ type: 'mobile', value: contactNumber }];
    }

    const patchPayload = {
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      Operations: [{ op: 'replace', value }],
    };

    await axios.patch(`${SCIM_BASE_URL}/${userId}`, patchPayload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('❌ Error updating profile:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
