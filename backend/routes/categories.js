const express = require('express');
const router = express.Router();

module.exports = (connection) => {
    // Your existing code
  

router.get("/categories", (req, res) => {
    connection.query(
      "SELECT CategoryName, Description FROM Category",
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
  router.delete('/categories/:categoryName', (req, res) => {
    console.log("Received delete request");
    const categoryName = req.params.categoryName;
    console.log('Received request to delete category:', categoryName);

    if (!categoryName) {
        return res.status(400).json({ error: 'Invalid data. Make sure to provide CategoryName.' });
    }
    connection.query(
        'DELETE FROM Category WHERE CategoryName = ?;',
        [categoryName],
        (error, results) => {
            if (error) {
                console.error('Error deleting category:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            console.log(results);
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.status(200).json({ success: true });
        }
    );
  });
  return router;
};
