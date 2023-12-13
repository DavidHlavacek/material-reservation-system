const express = require('express');
const router = express.Router();

module.exports = (connection) => {
    // Your existing code
  

router.get("/categories", (req, res) => {
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
  
  router.post('/categories', (req, res) => {
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

  return router;
};
