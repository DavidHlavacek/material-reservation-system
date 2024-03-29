const express = require('express');
const router = express.Router();
module.exports = (connection) => {

router.get("/items", (req, res) => {
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
  
  router.post("/items", (req, res) => {
    const newItem = req.body;
    console.log('Received request body:', newItem); // Add this line
    if (!newItem || !newItem.Name || !newItem.CategoryName || !newItem.Status) {
      return res.status(400).json({ error: 'Invalid data. Make sure to provide Name, CategoryName, and Status.' });
    }
  
    connection.query(
      'INSERT INTO Item (ItemID, CategoryName, BarcodeID, Name, Status) VALUES (?, ?, ?, ?, ?)',
      [newItem.ItemID, newItem.CategoryName, newItem.BarcodeID || null, newItem.Name, newItem.Status],
      (error, results) => {
        if (error) {
          console.error('Error inserting item:', error);
          return res.status(500).json({ error: 'Internal server error', msg: error });
        }
  
        const createdItemId = results.insertId;
        console.log("test");
        return res.status(201).json({ itemId: createdItemId });
      }
    );
  });
  
  return router;
};