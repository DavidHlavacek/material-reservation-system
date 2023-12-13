const mysql = require("mysql2");
const express = require("express");
var bodyParser = require('body-parser')
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "materialreservation",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

//API Endpoint for Item
app.get("/api/items", (req, res) => {
  connection.query(
    "SELECT Item.*, DATE_FORMAT(Reservation.BorrowDate, '%d/%m/%Y') AS DateReserved, Browser.Name AS Borrower FROM Item LEFT JOIN Reservation ON Item.ItemID = Reservation.ItemID LEFT JOIN Browser ON Reservation.UserID = Browser.UserID",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.setHeader("Content-Type", "application/json");
      res.json(results);
    }
  );
});

app.post("/api/items", (req, res) => {
  const newItem = req.body;
  console.log('Received request body:', newItem); // Add this line
  if (!newItem || !newItem.Name || !newItem.CategoryName || !newItem.Status) {
    return res.status(400).json({ error: 'Invalid data. Make sure to provide Name, CategoryName, and Status.' });
  }

  connection.query(
    'INSERT INTO Item (CategoryName, BarcodeID, Name, Status) VALUES (?, ?, ?, ?)',
    [newItem.CategoryName, newItem.BarcodeID || null, newItem.Name, newItem.Status],
    (error, results) => {
      if (error) {
        console.error('Error inserting item:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const createdItemId = results.insertId;
      console.log("test");
      res.status(201).json({ itemId: createdItemId });
    }
  );
});


app.get("/api/categories", (req, res) => {
  connection.query(
    "SELECT CategoryName FROM Category",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.setHeader("Content-Type", "application/json");
      res.json(results);
    }
  );
});

// ...

app.post('/api/categories', (req, res) => {
  const newCategory = req.body;
  console.log('Received request body:', newCategory); // Add this line
  if (!newCategory || !newCategory.CategoryName) {
    return res.status(400).json({ error: 'Invalid data. Make sure to provide CategoryName.' });
  }

  connection.query(
    'INSERT INTO Category (CategoryName, Description) VALUES (?, ?)',
    [newCategory.CategoryName, newCategory.Description],
    (error, results) => {
      if (error) {
        console.error('Error inserting category:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const createdCategoryId = results.insertId;
      res.status(201).json({ categoryId: createdCategoryId });
    }
  );
});

// ...





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
