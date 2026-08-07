const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function verifyUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users in DB:`);

    for (const u of users) {
      const match = await bcrypt.compare('password123', u.password);
      console.log(`- Email: "${u.email}", Role: "${u.role}", Password 'password123' Match: ${match}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Verify error:', err);
    process.exit(1);
  }
}

verifyUsers();
