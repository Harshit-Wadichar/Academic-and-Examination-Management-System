const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Replace with your email
    const email = 'your-email@example.com'; // CHANGE THIS TO YOUR EMAIL
    
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`User ${email} is now admin`);
      console.log('User details:', user);
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();