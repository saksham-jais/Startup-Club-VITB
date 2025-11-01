// const bcrypt = require('bcryptjs');
// bcrypt.hash('admin@123', 10).then(hash => console.log(hash));


const bcrypt = require('bcryptjs');
const hash = '$2b$10$HBMs.BUXf0LiUDPT8BxMhOpzDYkgjsb67pVm2SOfooY.hC1Sea4Tm';
bcrypt.compare('admin@123', hash).then(result => console.log(result));