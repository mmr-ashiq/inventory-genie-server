import jwt from 'jsonwebtoken';
import { config } from '../../../config/lib/config.js';

export const isAuthorized = ({ allowedRole = [], allowedPermissions = [] }) => {
  return (req, res, next) => {
    try {
      let token;

      const cookie = req.cookies?.token || null;
      const bearerToken = req.headers.authorization?.split(' ')[1] || null;

      if (cookie) {
        token = cookie;
      } else {
        token = bearerToken;
      }

      if (!token)
        return res.status(401).json({
          success: false,
          message: 'UNAUTHORIZED',
        });

      //   verify token
      const decoder = jwt.verify(token, config.jwtSecret);

      const { role, permissions } = decoder;

      if (allowedRole?.length && !allowedRole.includes(role))
        return res.status(401).json({
          success: false,
          message: 'UNAUTHORIZED',
        });

      if (
        allowedPermissions &&
        allowedPermissions?.length &&
        !allowedPermissions.some((permission) => permissions.includes(permission))
      )
        return res.status(401).json({
          success: false,
          message: 'UNAUTHORIZED',
        });

      req.userData = {
        userId: decoder.userId,
        role: decoder.role,
        permissions: decoder.permissions,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};
