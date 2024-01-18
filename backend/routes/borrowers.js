const express = require("express")
const router = express.Router()

module.exports = (connection) => {
    // Your existing code
    router.get("/borrowers", (req, res) => {
        const borrowerName = req.params.name
        connection.query(
            "SELECT * FROM Browser",

            (error, results) => {
                if (error) {
                    throw error
                }
                res.setHeader("Content-Type", "application/json")
                res.json(results)
            }
        )
    })
    router.get("/borrowers/:name", (req, res) => {
        const borrowerName = req.params.name
        connection.query(
            "SELECT Email FROM Browser WHERE Name = ?",
            [borrowerName],
            (error, results) => {
                if (error) {
                    throw error
                }
                res.setHeader("Content-Type", "application/json")
                res.json(results)
            }
        )
    })

    return router
}
