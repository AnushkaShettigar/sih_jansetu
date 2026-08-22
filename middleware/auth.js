import jwt from 'jsonwebtoken';

// Verifies "Authorization: Bearer <token>" and attaches req.user = { id, role }.
// Any missing/malformed/invalid/expired token results in a 401.
function verifyJWT(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header.' });
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export default verifyJWT;
