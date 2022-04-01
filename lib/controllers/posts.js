const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, req, next) => {});
