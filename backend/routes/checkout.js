const express = require("express")
const router = express.Router()

module.exports = (connection) => {
    router.get("/itemByBarcode/:barcodeId", (req, res) => {
        const barcodeId = req.params.barcodeId
        console.log(`requested barcode: ${barcodeId}`)
        connection.query(
            // TODO: change to use BarcodeID instead of ItemID in WHERE
            "SELECT ItemID, CategoryName, BarcodeID, Name, Status FROM Item WHERE ItemID = ?",
            [barcodeId],
            (error, results) => {
                if (error) {
                    console.error("Error getting item status:", error)
                    return res
                        .status(500)
                        .json({ error: "Internal server error" })
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "Item not found" })
                }

                res.setHeader("Content-Type", "application/json")
                res.json(results)
            }
        )
    })

    router.get("/uniqueReservation/:itemId", (req, res) => {
        const itemId = req.params.itemId
        connection.query(
            "SELECT Reservation.UserID as UserID, Reservation.ItemID AS ItemID, Item.CategoryName AS CategoryName, Browser.Name AS Borrower, DATE_FORMAT(Reservation.BorrowDate, '%d/%m/%Y') AS DateReserved, DATE_FORMAT(Reservation.ReturnDate, '%d/%m/%Y') AS DateReturned FROM Reservation JOIN Item ON Reservation.ItemID = Item.ItemID JOIN Browser ON Reservation.UserID = Browser.UserID WHERE Reservation.ReturnDate IS NULL AND Reservation.ItemID = ?;",
            [itemId],
            (error, results) => {
                if (error) {
                    return res
                        .status(500)
                        .json({ error: "Internal server error" })
                }
                if (results.length == 0) {
                    res.json({})
                } else {
                    res.json(results)
                }
            }
        )
    })

    router.get("/nonUniqueReservation/:itemId/:userId", (req, res) => {
        const itemId = req.params.itemId
        const userId = req.params.userId
        connection.query(
            "SELECT Reservation.UserID as UserID, Reservation.ItemID AS ItemID, Item.CategoryName AS CategoryName, Browser.Name AS Borrower, DATE_FORMAT(Reservation.BorrowDate, '%d/%m/%Y') AS DateReserved, DATE_FORMAT(Reservation.ReturnDate, '%d/%m/%Y') AS DateReturned FROM Reservation JOIN Item ON Reservation.ItemID = Item.ItemID JOIN Browser ON Reservation.UserID = Browser.UserID WHERE Reservation.ReturnDate IS NULL AND Reservation.ItemID = ? AND Reservation.UserID = ?;",
            [itemId, userId],
            (error, results) => {
                if (error) {
                    return res
                        .status(500)
                        .json({ error: "Internal server error" })
                }
                if (results.length == 0) {
                    res.json({})
                } else {
                    res.json(results)
                }
            }
        )
    })

    router.get("/getItemStatus/:itemId", (req, res) => {
        const itemId = req.params.itemId

        connection.query(
            "SELECT Status FROM Item WHERE ItemID = ?",
            [itemId],
            (error, results) => {
                if (error) {
                    console.error("Error getting item status:", error)
                    return res
                        .status(500)
                        .json({ error: "Internal server error" })
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "Item not found" })
                }

                res.setHeader("Content-Type", "application/json")
                res.json({ status: results[0].Status })
            }
        )
    })

    router.post("/checkoutItem", (req, res) => {
      const { itemId, userId } = req.body;
      console.log(`Attempting to checkout item: ${itemId} for user: ${userId}`);
  
      // First, ensure the item is not already issued
      connection.query(
          'SELECT Status FROM Item WHERE ItemID = ?', [itemId],
          (findError, findResults) => {
              if (findError) {
                  console.error('Error finding item:', findError);
                  return res.status(500).json({ error: 'Internal server error' });
              }
              if (findResults.length === 0 || findResults[0].Status === 'Issued') {
                  return res.status(400).json({ error: 'Item not found or already issued' });
              }
  
              // If item is available, proceed to checkout process
              connection.query(
                  'UPDATE Item SET Status = "Issued" WHERE ItemID = ?', [itemId],
                  (updateError) => {
                      if (updateError) {
                          console.error('Error updating item status:', updateError);
                          return res.status(500).json({ error: 'Internal server error' });
                      }
  
                      // Insert into Reservation table
                      connection.query(
                          'INSERT INTO Reservation (UserID, ItemID, BorrowDate) VALUES (?, ?, CURDATE())', [userId, itemId],
                          (insertError) => {
                              if (insertError) {
                                  console.error('Error creating reservation:', insertError);
                                  return res.status(500).json({ error: 'Error creating reservation' });
                              }
                              res.json({ success: true, message: 'Item checked out successfully' });
                          }
                      );
                  }
              );
          }
      );
  });
  

    router.post("/returnItem", (req, res) => {
        const { itemId } = req.body

        // Update the reservation to mark it as returned
        connection.query(
            "UPDATE Reservation SET ReturnDate = CURDATE() WHERE ItemID = ? AND ReturnDate IS NULL",
            [itemId],
            (updateError, updateResults) => {
                if (updateError)
                    return res
                        .status(500)
                        .json({ error: "Error updating reservation" })
                if (updateResults.affectedRows === 0)
                    return res
                        .status(404)
                        .json({ error: "No active reservation found for item" })

                // Update the item to mark it as not issued
                connection.query(
                    'UPDATE Item SET Status = "Not issued" WHERE ItemID = ?',
                    [itemId],
                    (itemUpdateError) => {
                        if (itemUpdateError)
                            return res
                                .status(500)
                                .json({ error: "Error updating item status" })
                        res.json({
                            success: true,
                            message: "Item returned successfully",
                        })
                    }
                )
            }
        )
    })

    router.get("/getBorrower/:nfcId", (req, res) => {
        const nfcId = req.params.nfcId

        // Validate nfcId
        if (!nfcId) {
            return res.status(400).json({ error: "NFCId is required" })
        }

        // Implement logic to fetch borrower details from the database based on NFCId
        connection.query(
            "SELECT * FROM Browser WHERE NFCId = ?",
            [nfcId],
            (error, results) => {
                if (error) {
                    console.error("Error fetching borrower details:", error)
                    return res
                        .status(500)
                        .json({ error: "Internal server error" })
                }

                // Check if borrower exists
                if (results.length === 0) {
                    return res.status(404).json({ error: "Borrower not found" })
                }

                // Borrower found, return borrower details
                const borrower = results
                return res.status(200).json(borrower)
            }
        )
    })

    return router
}
