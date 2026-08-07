const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`==========================================================`);
    console.log(`🚀 BookVerse Studio Backend API Listening on Port ${env.PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   Base API URL: http://localhost:${env.PORT}/api`);
    console.log(`==========================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
