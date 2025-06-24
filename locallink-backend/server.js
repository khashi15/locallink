// server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Sample in-memory DB
let services = [];
let idCounter = 1;

// 🔐 Middleware: JWT Auth
const client = jwksClient({
  jwksUri: `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/jwks`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"],
      audience: process.env.CLIENT_ID,
      issuer: `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/token`,
    },
    (err, user) => {
      if (err) {
        console.error("JWT validation failed:", err);
        console.log("Expected audience:", process.env.CLIENT_ID);
        return res.sendStatus(403);
      }
      console.log("✅ Decoded JWT:", user);
      req.user = user;
      next();
    }
  );
}

// ✅ API Routes

// GET all services - visible to all authenticated users
app.get("/api/services", authenticateToken, (req, res) => {
  res.json(services);
});

// POST create a new service - only service providers
app.post("/api/services", authenticateToken, (req, res) => {
  const roles = req.user.roles;

  // Debug logs to inspect the roles field
  console.log("🔍 User roles raw type:", typeof roles);
  console.log("🔍 User roles raw value:", roles);

  // Check if roles includes "service_provider"
  const isServiceProvider = Array.isArray(roles)
    ? roles.includes("service_provider")
    : typeof roles === "string" &&
      roles.split(",").map((r) => r.trim()).includes("service_provider");

  if (!isServiceProvider) {
    return res
      .status(403)
      .json({ message: "Forbidden: Not a service provider" });
  }

  const { title, description } = req.body;
  const newService = {
    id: idCounter++,
    title,
    description,
    provider_user_id: req.user.sub,
  };
  services.push(newService);
  res.status(201).json(newService);
});

// PUT update own service - only owner can update
app.put("/api/services/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const service = services.find((s) => s.id === id);

  if (!service) return res.status(404).json({ message: "Not found" });

  if (service.provider_user_id !== req.user.sub) {
    return res.status(403).json({ message: "Forbidden: Not your service" });
  }

  service.title = req.body.title || service.title;
  service.description = req.body.description || service.description;
  res.json(service);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 LocalLink backend running on port ${PORT}`);
});

