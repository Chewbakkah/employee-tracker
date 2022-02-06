const promptUser = require('./src/prompt');
const db = require('./config/connection');

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('WELCOME TO EMPLOYEE TRACKER');
  promptUser();
  });
