const express = require('express');
const router = express.Router();
const crypto = require('crypto');

function hash(string) {
    return crypto.createHash('sha256').update(string).digest('hex');
}

module.exports = (connection) => {
    router.post('/login', (req, res) => {
        console.log('Received login request', req.body);
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = hash(password);

        connection.query(
            "SELECT HashedPassword FROM Admin WHERE Email = ?",
            [email],
            (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                else if (results.length == 0) {
                    return res.status(404).json({ error: 'Email not in db'});
                }
                console.log(results);
                const storedHashedPassword = results[0].HashedPassword;
                if (storedHashedPassword !== hashedPassword) {
                    return res.status(403).json({error: "Incorrect password"});
                }
                // TODO
                // add tokens
                // remove 200
                return res.status(200).json({token: "something"});
            }
        );
    });
    return router;
};