const jwt = require('jsonwebtoken');

exports.isAuthorized = ({ allowedRole, allowedPermissions }) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const decoder = jwt.verify(token, process.env.JWT_SECRET);

      const { role, permissions } = decoder;
      console.log(permissions);

      if (allowedRole?.length && !allowedRole.includes(role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      if (
        allowedPermissions &&
        !allowedPermissions.some((permission) =>
          permissions.includes(permission)
        )
      ) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      req.userData = {
        id: decoder.id,
        role: decoder.role,
        permissions: decoder.permissions,
      };

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
  };
};
