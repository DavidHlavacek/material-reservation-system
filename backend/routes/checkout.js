const express = require('express');
const router = express.Router();

module.exports = (connection) => {

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
          'UPDATE Reservation SET ReturnDate = CURRENT_DATE WHERE ItemID = ?',
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