import bcrypt from 'bcryptjs';

// Function to hash the password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt with cost factor 10
    const hash = await bcrypt.hash(password, salt); // Generate hash
    return hash;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Example usage
const password = 'password123';  // insert password to be hashed here, used to make admin account 
hashPassword(password)
  .then((hash) => {
    console.log('Hashed password:', hash);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
