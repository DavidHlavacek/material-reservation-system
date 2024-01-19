const express = require('express');
const router = express.Router();
module.exports = (connection) => {
    router.get("/check-email/:email", (req, res) => {
        let userEmail = req.params.email; // Use req.params.email to get the email parameter
        connection.query(
            "SELECT 'User' AS UserType, UserId AS Id, Email FROM Users WHERE Email = ? " +
            "UNION " +
            "SELECT 'Admin' AS UserType, AdminId AS Id, Email FROM Admins WHERE Email = ?;",
            [userEmail, userEmail],
            (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.setHeader("Content-Type", "application/json");
            return res.json(results);
        }
    );
    });
    router.post("/register", (req, res) => {
        const { email, name, barcode } = req.body;
        connection.query(
            "INSERT INTO Users (Email, Name, Barcode) VALUES (?, ?, ?);",
            [email, name, barcode],
            (error, results) => {
                if (error) {
                    console.error('Error saving registration data to the database:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
      
                // Send a success response
                res.status(201).json({ success: true });
            }
        );
    });
    return router;
}