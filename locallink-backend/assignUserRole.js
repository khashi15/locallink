// assignUserRole.js
const axios = require("axios");

/**
 * Assign a user to a role in Asgardeo using SCIM2 API.
 *
 * @param {string} orgName - Your Asgardeo organization name.
 * @param {string} userId - The user's ID (SCIM ID, not email).
 * @param {string} roleName - The display name of the role (e.g., 'service_provider').
 * @param {string} accessToken - A valid management API token with necessary permissions.
 */
async function assignUserRole(orgName, userId, roleName, accessToken) {
  const apiBase = `https://api.asgardeo.io/t/${orgName}/scim2`;

  try {
    // ✅ Step 1: Fetch Role ID by role name
    const roleRes = await axios.get(
      `${apiBase}/Roles?filter=displayName eq "${roleName}"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const roles = roleRes.data?.Resources;
    if (!roles || roles.length === 0) {
      throw new Error(`❌ Role '${roleName}' not found in Asgardeo`);
    }

    const roleId = roles[0].id;

    // ✅ Step 2: Prepare PATCH payload
    const patchPayload = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      Operations: [
        {
          op: "add",
          path: "roles",
          value: [
            {
              value: roleId,
              display: roleName,
            },
          ],
        },
      ],
    };

    // ✅ Step 3: Patch user to assign the role
    await axios.patch(`${apiBase}/Users/${userId}`, patchPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Successfully assigned role '${roleName}' to user '${userId}'`);
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("❌ Failed to assign role:", errData);
    throw new Error(
      `❌ Error assigning role '${roleName}' to user '${userId}': ${JSON.stringify(
        errData
      )}`
    );
  }
}

module.exports = { assignUserRole };
