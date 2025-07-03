const express = require("express");
const router = express.Router();
const axios = require("axios");
const { checkJwt } = require("../middleware/auth");
const { getManagementAccessToken } = require("../utils/asgardeoUtils");

const SCIM_BASE_URL = "https://api.asgardeo.io/t/YOUR_ORG/scim2/Users";  // Replace YOUR_ORG

// Fetch User Profile (optional, keeps your existing code)
router.get("/profile", checkJwt, async (req, res) => {
  try {
    const accessToken = await getManagementAccessToken();
    const userEmail = req.auth.email;

    const userResponse = await axios.get(
      `${SCIM_BASE_URL}?filter=userName eq "DEFAULT/${userEmail}"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const user = userResponse.data.Resources?.[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.userName,
      firstName: user.name?.givenName || "",
      lastName: user.name?.familyName || "",
      contactNumber: user.phoneNumbers?.[0]?.value || "",
      email: user.emails?.[0]?.value || "",
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// ✅ Assign Role API (NEW)
router.post("/profile", checkJwt, async (req, res) => {
  try {
    const userEmail = req.auth.email;
    const { role } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "No email found in token" });
    }
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const accessToken = await getManagementAccessToken();

    const userRes = await axios.get(
      `${SCIM_BASE_URL}?filter=userName eq "DEFAULT/${userEmail}"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const user = userRes.data.Resources?.[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user.id;

    const patchPayload = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      Operations: [
        {
          op: "add",
          path: "roles",
          value: [role],
        },
      ],
    };

    await axios.patch(`${SCIM_BASE_URL}/${userId}`, patchPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json({ message: "Role assigned successfully" });
  } catch (error) {
    console.error("❌ Error assigning role:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to assign role" });
  }
});

module.exports = router;
