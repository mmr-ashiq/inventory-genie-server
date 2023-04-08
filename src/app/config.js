import * as dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  clientOrigin: process.env.CLIENT_ORIGIN,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRES_TIME,
  cloudnaryUrl: process.env.CLOUDINARY_URL,
  cloudnaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudnaryApiSecret: process.env.CLOUDINARY_SECRET_KEY,
  cloudnaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
});
