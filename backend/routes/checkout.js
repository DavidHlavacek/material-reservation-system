const express = require('express');
const router = express.Router();

module.exports = (connection) => {
    router.get("/itemByBarcode/:barcodeId", (req, res) => {
        const barcodeId = req.params.barcodeId;
        console.log(`requested barcode: ${barcodeId}`);
        connection.query(
          // TODO: change to use BarcodeID instead of ItemID in WHERE
          "SELECT ItemID, CategoryName, BarcodeID, Name, Status FROM Item WHERE ItemID = ?",
          [barcodeId],
          (error, results) => {
            if (error) {
              console.error('Error getting item status:', error);
              return res.status(500).json({ error: 'Internal server error' });
            }
    
            if (results.length === 0) {
              return res.status(404).json({ error: 'Item not found' });
            }
    
            res.setHeader("Content-Type", "application/json");
            res.json(results);
          }
        )
    });

    router.get("/uniqueReservation/:itemId", (req, res) => {
      const itemId = req.params.itemId;
      connection.query(
      "SELECT Reservation.UserID as UserID, Reservation.ItemID AS ItemID, Item.CategoryName AS CategoryName, Browser.Name AS Borrower, DATE_FORMAT(Reservation.BorrowDate, '%d/%m/%Y') AS DateReserved, DATE_FORMAT(Reservation.ReturnDate, '%d/%m/%Y') AS DateReturned FROM Reservation JOIN Item ON Reservation.ItemID = Item.ItemID JOIN Browser ON Reservation.UserID = Browser.UserID WHERE Reservation.ReturnDate IS NULL AND Reservation.ItemID = ?;",
      [itemId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length == 0) {
          res.json({});
        }
        else {
          res.json(results);
        }
      }
      )
    });

    router.get("/nonUniqueReservation/:itemId/:userId", (req, res) => {
      const itemId = req.params.itemId;
      const userId = req.params.userId;
      connection.query(
      "SELECT Reservation.UserID as UserID, Reservation.ItemID AS ItemID, Item.CategoryName AS CategoryName, Browser.Name AS Borrower, DATE_FORMAT(Reservation.BorrowDate, '%d/%m/%Y') AS DateReserved, DATE_FORMAT(Reservation.ReturnDate, '%d/%m/%Y') AS DateReturned FROM Reservation JOIN Item ON Reservation.ItemID = Item.ItemID JOIN Browser ON Reservation.UserID = Browser.UserID WHERE Reservation.ReturnDate IS NULL AND Reservation.ItemID = ? AND Reservation.UserID = ?;",
      [itemId, userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length == 0) {
          res.json({});
        }
        else {
          res.json(results);
        }
      }
      )
    });

    router.get("/getItemStatus/:itemId", (req, res) => {
        const itemId = req.params.itemId;
    
        connection.query(
          "SELECT Status FROM Item WHERE ItemID = ?",
          [itemId],
          (error, results) => {
            if (error) {
              console.error('Error getting item status:', error);
              return res.status(500).json({ error: 'Internal server error' });
            }
    
            if (results.length === 0) {
              return res.status(404).json({ error: 'Item not found' });
            }
    
            res.setHeader("Content-Type", "application/json");
            res.json({ status: results[0].Status });
          }
        );
      });

  router.post("/checkoutItem", (req, res) => {
    const itemId = req.body.itemId;
    const userId = req.body.userId;

    // Implement logic to update item status to 'Not Issued'
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      connection.query(
        'UPDATE Item SET Status = "Not Issued" WHERE ItemID = ?',
        [itemId],
        (error, results) => {
          if (error) {
            console.error('Error updating item status:', error);
            return connection.rollback(() => res.status(500).json({ error: 'Internal server error' }));
          }

          connection.query(
            'INSERT INTO Reservation (UserID, ItemID, BorrowDate) VALUES (?, ?, CURRENT_DATE)',
            [userId, itemId],
            (err, results) => {
              if (err) {
                console.error('Error inserting into Reservation table:', err);
                return connection.rollback(() => res.status(500).json({ error: 'Internal server error' }));
              }

              connection.commit((err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  return connection.rollback(() => res.status(500).json({ error: 'Internal server error' }));
                }

                return res.status(200).json({ success: true });
              });
            }
          );
        }
      );
    });
  });

  router.post("/returnItem", (req, res) => {
    const itemId = req.body.itemId;

    // Implement logic to update item status to 'Issued' and set ReturnDate to current date
    connection.query(
      'UPDATE Item SET Status = "Issued" WHERE ItemID = ?',
      [itemId],
      (error, results) => {
        if (error) {
          console.error('Error updating item status:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        connection.query(
          'UPDATE Reservation SET ReturnDate = CURRENT_DATE WHERE ItemID = ? AND ReturnDate IS NULL',
          [itemId],
          (err, results) => {
            if (err) {
              console.error('Error updating ReturnDate in Reservation table:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ success: true });
          }
        );
      }
    );
  });

  return router;
};
