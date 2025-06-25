const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const ASGARDEO_ORG = process.env.ASGARDEO_ORG;
const AUDIENCE = process.env.ASGARDEO_CLIENT_ID;

if (!ASGARDEO_ORG || !AUDIENCE) {
  console.warn('⚠️ Warning: ASGARDEO_ORG or ASGARDEO_CLIENT_ID environment variables are not set.');
}

const ISSUER = `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/token`;

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/jwks`
  }),
  audience: AUDIENCE,
  issuer: ISSUER,
  algorithms: ['RS256']
});

module.exports = checkJwt;
