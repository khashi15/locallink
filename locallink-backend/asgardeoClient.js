// locallink-backend/asgardeoClient.js
const axios = require('axios');

const orgName = process.env.ASGARDEO_ORG;
const clientId = process.env.ASGARDEO_CLIENT_ID;
const clientSecret = process.env.ASGARDEO_CLIENT_SECRET;

const tokenEndpoint = `https://api.asgardeo.io/t/${orgName}/oauth2/token`;
const usersEndpoint = `https://api.asgardeo.io/t/${orgName}/scim2/Users`;

/**
 * Get Management API Token using client credentials flow
 */
async function getManagementAPIToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'internal_user_mgt_list internal_user_mgt_view');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
  };

  try {
    const response = await axios.post(tokenEndpoint, params, { headers });
    return response.data.access_token;
  } catch (err) {
    console.error('❌ Failed to get Management API token:', err.response?.data || err.message);
    throw err;
  }
}

/**
 * Fetch all users from Asgardeo SCIM API
 */
async function getAllUsers() {
  const token = await getManagementAPIToken();

  try {
    const response = await axios.get(usersEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.Resources; // Array of user objects
  } catch (err) {
    console.error('❌ Failed to fetch users:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  getManagementAPIToken,
  getAllUsers,
};
