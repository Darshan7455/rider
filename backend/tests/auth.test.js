const assert = require('assert');
const { generateToken, verifyJWT } = require('../utils/jwt.token');

(async () => {
  const payload = { email: 'test@example.com' };
  const token = await generateToken(payload);
  const decoded = await verifyJWT(token);

  assert.strictEqual(decoded.email, payload.email);
  console.log('auth token round-trip ok');
})();
