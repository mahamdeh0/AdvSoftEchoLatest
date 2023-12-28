const {createPool} = require('mysql');


 const pool = createPool({
  host:"localhost",
  user:"root",
  password:"",
  database:"echotrack",
  
  connectionLimit:10
})

module.exports = pool;