// Usage: router.post('/x', verifyJWT, authorize('authority', 'admin'), handler)
// Must run after verifyJWT — depends on req.user being set.
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    return next();
  };
}

export default authorize;
