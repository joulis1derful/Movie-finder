const dataInitializer = require('./lib/dataSeeder')
const config = require('./config/config.development.json')
const db = require('./lib/database');

db.init(config.databaseConfig);

console.log('Initializing Data');
dataInitializer.initializeData(function(err) {
  if (err) {
      console.log(err);
  }
  else {
      console.log('Data Initialized!')
  }
});

// docker inspect 2365566ff371 | grep IPAddress