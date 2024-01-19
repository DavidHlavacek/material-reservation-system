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
    return router;
}