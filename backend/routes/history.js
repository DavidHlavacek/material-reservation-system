const express = require('express');
const router = express.Router();
module.exports = (connection) => {
  router.get("/history", (req, res) => {
    connection.query(
      "SELECT Reservation.UserID as UserID, Reservation.ItemID AS ItemID, Item.CategoryName AS CategoryName, Browser.Name AS Borrower, DATE_FORMAT(Reservation.BorrowDate, '%d/%m/%Y') AS DateReserved, DATE_FORMAT(Reservation.ReturnDate, '%d/%m/%Y') AS DateReturned FROM Reservation JOIN Item ON Reservation.ItemID = Item.ItemID JOIN Browser ON Reservation.UserID = Browser.UserID;",
      (error, results) => {
        if (error) {
          throw error;
        }
        res.setHeader("Content-Type", "application/json");
        res.json(results);
      }
    );
  });
  
  router.post("/history", (req, res) => {
    const newEntry = req.body;
    if (!newEntry || !newEntry.ItemID || !newEntry.CategoryName || !newEntry.Borrower || !newEntry.DateReserved) {
      return res.status(400).json({ error: 'Invalid data. Make sure to provide itemID, CategoryName, Borrower, and DateReserved.' });
    }
    connection.query(
      "INSERT INTO `Reservation` (`UserID`, `ItemID`, `BorrowDate`, `ReturnDate`) VALUES (?, ?, ?, ?)",
      [newEntry.UserID, newEntry.ItemID, newEntry.DateReserved, newEntry.DateReturned || null],
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
  return router;
}