import mongoose from 'mongoose';

import { app } from './src/config/lib/app.js';
import { config } from './src/config/lib/config.js';
import { seedAdmin } from './src/modules/platform-users/admin.seed.js';

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
