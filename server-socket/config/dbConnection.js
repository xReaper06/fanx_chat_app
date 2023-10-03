const { DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME } = process.env;

var mysql = require('mysql2')

var conn = mysql.createConnection({
    host:DB_HOST ,
    user : DB_USERNAME  ,
    password:DB_PASSWORD,
    database:DB_NAME
})

conn.connect(function(err){
    if (err) throw err;
    console.log(DB_NAME+' Database connected successfully')
})
module.exports=conn