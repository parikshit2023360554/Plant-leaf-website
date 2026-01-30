let randomUUID;
try {
  ({ randomUUID } = require('crypto'));
} catch (_) {
  randomUUID = null;
}

const generateId = () => {
  if (typeof randomUUID === 'function') return randomUUID();
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

module.exports = () => (req, res, next) => {
  const id = generateId();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
};