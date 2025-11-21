// const bcrypt = require('bcryptjs');
// bcrypt.hash('admin@123', 10).then(hash => console.log(hash));


import bcrypt from 'bcryptjs';




// const bcrypt = require('bcryptjs');  // Assumes you have bcryptjs installed (npm i bcryptjs if not)

const newPassword = '';  // <-- CHANGE THIS to your desired password
const saltRounds = 10;

bcrypt.hash(newPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('New hash (copy this to .env):');
  console.log(hash);
});



const hash = '';
bcrypt.compare('', hash).then(result => console.log(result));