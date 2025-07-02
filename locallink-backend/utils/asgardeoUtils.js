const axios = require('axios');

async function getManagementAccessToken() {
  const clientId = process.env.ASGARDEO_CLIENT_ID;
  const clientSecret = process.env.ASGARDEO_CLIENT_SECRET;
  const tenant = process.env.ASGARDEO_ORG;

  const tokenUrl = `https://api.asgardeo.io/t/${tenant}/oauth2/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'internal_user_mgt_view');

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error fetching Management API token:', error.response?.data || error.message);
    throw error;
  }
}

async function fetchAllUsersFromAsgardeo(accessToken) {
  const tenant = process.env.ASGARDEO_ORG;
  const usersUrl = `https://api.asgardeo.io/t/${tenant}/o/api/users`;

  try {
    const response = await axios.get(usersUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching users:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  getManagementAccessToken,
  fetchAllUsersFromAsgardeo,
};