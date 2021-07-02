var mysql = require('mysql');
const credentials = require('./jsonCredentials.json');
var con = mysql.createConnection({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
  insecureAuth: true,
  multipleStatements: true
});

con.connect((err) => {
  if (!err) {
    console.log('DB connection successful!');
  }
  else {
    console.log('Db Connection Failed : ' + JSON.stringify(err, undefined, 2));
  }
})
module.exports = con;
