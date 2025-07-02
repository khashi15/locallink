const express = require("express");
const router = express.Router();
const axios = require("axios");
const { checkJwt } = require("../middleware/auth");
require("dotenv").config();

// 🔧 Environment Variables
const ASGARDEO_ORG_NAME = process.env.ASGARDEO_ORG;
const CLIENT_ID = process.env.ASGARDEO_ADMIN_CLIENT_ID;
const CLIENT_SECRET = process.env.ASGARDEO_ADMIN_CLIENT_SECRET;

// 🔍 Debug Logs
console.log("🛠️ Org:", ASGARDEO_ORG_NAME);
console.log("🛠️ Admin Client ID:", CLIENT_ID);
console.log("🛠️ Admin Client Secret:", CLIENT_SECRET ? "✔️ Loaded" : "❌ Missing");

// 🔐 Get Asgardeo client credentials token
async function getClientCredentialsToken() {
  console.log("🔑 Requesting token from Asgardeo...");

  try {
    const tokenResponse = await axios.post(
      `https://api.asgardeo.io/t/${ASGARDEO_ORG_NAME}/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: "urn:ietf:params:scim:api:messages:2.0:Users.write",
      }),
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("🔑 Token response:", tokenResponse.data);
    return tokenResponse.data.access_token;
  } catch (err) {
    console.error("❌ Failed to get token:", err.response?.data || err.message);
    throw err;
  }
}

// 🔥 Profile Update Endpoint (secured)
router.post("/profile/update", checkJwt, async (req, res) => {
  const { firstName, lastName, mobileNumber } = req.body;
  const userId = req.auth?.sub;

  console.log("📦 Incoming profile update request for user:", userId);
  console.log("📦 Payload:", { firstName, lastName, mobileNumber });

  if (!userId) {
    console.error("❌ Unauthorized: No user ID in token");
    return res.status(401).json({ message: "Unauthorized: No user ID" });
  }

  if (!firstName && !lastName && !mobileNumber) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const token = await getClientCredentialsToken();

    const patchPayload = {
      Operations: [
        {
          op: "Replace",
          value: {
            ...(firstName || lastName
              ? {
                  name: {
                    ...(firstName && { givenName: firstName }),
                    ...(lastName && { familyName: lastName }),
                  },
                }
              : {}),
            ...(mobileNumber
              ? {
                  phoneNumbers: [
                    {
                      type: "mobile",
                      value: mobileNumber,
                    },
                  ],
                }
              : {}),
          },
        },
      ],
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    };

    console.log("🚀 Sending PATCH request to Asgardeo SCIM API...");
    console.log(
      "➡️ PATCH URL:",
      `https://api.asgardeo.io/t/${ASGARDEO_ORG_NAME}/scim2/Users/${userId}`
    );
    console.log("➡️ PATCH Payload:", JSON.stringify(patchPayload, null, 2));

    const response = await axios.patch(
      `https://api.asgardeo.io/t/${ASGARDEO_ORG_NAME}/scim2/Users/${userId}`,
      patchPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Profile updated successfully in Asgardeo:", response.data);

    res.json({ message: "✅ Profile updated successfully" });
  } catch (err) {
    console.error(
      "❌ Error updating profile:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "❌ Failed to update profile" });
  }
});

module.exports = router;
