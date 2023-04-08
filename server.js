import { app } from './src/app/app.js';
import mongoose from 'mongoose';
import { config } from './src/app/config.js';
import { seedAdmin } from './src/seeds/admin.seed.js';

mongoose.set('strictQuery', false);

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB is connected');

    app.listen(config.port);

    await seedAdmin();
    console.log(`Server is running on port ${config.port}`);
  } catch (error) {
    console.log(error);
  }
};

startServer();
