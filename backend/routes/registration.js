const express = require("express");
const router = express.Router();

module.exports = (connection) => {
  router.get("/check-email", (req, res) => {
    const { email } = req.query;

    // Check in Users table
    const usersSql = "SELECT * FROM Browser WHERE email = ?";
    connection.query(usersSql, [email], (err, usersResults) => {
      if (err) {
        console.error(err);
        throw res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check in Admins table
      const adminsSql = "SELECT * FROM Admin WHERE email = ?";
      connection.query(adminsSql, [email], (err, adminsResults) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({
            exists: usersResults.length > 0 || adminsResults.length > 0,
          });
        }
      });
    });
  });

  router.post("/register", (req, res) => {
    const { email, name, barcode } = req.body;
    connection.query(
      "INSERT INTO Browser (Email, Name, UserID) VALUES (?, ?, ?);",
      [email, name, barcode],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Send a success response
        res.status(201).json(results);
      }
    );
  });

  return router;
};
