const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const ASGARDEO_ORG = process.env.ASGARDEO_ORG;
const AUDIENCE = process.env.ASGARDEO_CLIENT_ID;

if (!ASGARDEO_ORG || !AUDIENCE) {
  console.warn('⚠️ ASGARDEO_ORG or ASGARDEO_CLIENT_ID environment variables are not set.');
}

const ISSUER = `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/token`;

// JWT Auth Middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/jwks`,
  }),
  audience: AUDIENCE,
  issuer: ISSUER,
  algorithms: ['RS256'],
  requestProperty: 'auth',
});

// Role Authorization Middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRolesRaw = req.auth?.roles || req.auth?.role || '';
    let userRoles = [];

    if (Array.isArray(userRolesRaw)) {
      userRoles = userRolesRaw;
    } else if (typeof userRolesRaw === 'string') {
      userRoles = userRolesRaw.split(',').map((r) => r.trim());
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
}

// Attach user info middleware (optional)
function attachUser(req, res, next) {
  if (req.auth) {
    req.user = {
      sub: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name,
      roles: req.auth.roles || req.auth.role || [],
    };
  }
  next();
}

module.exports = {
  checkJwt,
  authorizeRoles,
  attachUser,
};