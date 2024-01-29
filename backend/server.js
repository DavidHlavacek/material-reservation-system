const mysql = require("mysql2");
const express = require("express");
var bodyParser = require('body-parser')
const cors = require("cors");
const { connect } = require("http2");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "materialreservation",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

const itemsRoute = require('./routes/items')(connection);
const categoriesRoute = require('./routes/categories')(connection);
const borrowersRoute = require('./routes/borrowers')(connection);
const emailRoute = require('./routes/mail')(connection); // Include the email route
const loginRoute = require('./routes/login')(connection);


app.use('/api', itemsRoute); // Mount the 'items' route under '/api/items'
app.use('/api', categoriesRoute); 
app.use('/api', borrowersRoute);
app.use('/api', emailRoute); // Mount the email route under '/api/send-email'
app.use('/api', loginRoute);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
