const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = (connection) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com', // Update with your SMTP host
        port: 587, // Update with your SMTP port
        auth: {
            user: 'davehlave@gmail.com',
            pass: 'vbYgFZQkdGD8RX6c',
          },
      });
  
    router.post('/send-email', (req, res) => {
        const { to, subject, body } = req.body;
      
        const mailOptions = {
          from: 'studentinfo@example.com', // Update with your email
          to,
          subject,
          text: body,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, error: 'Error sending email' });
          } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ success: true, message: 'Email sent successfully' });
          }
        });
      });

  return router;
};
