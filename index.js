const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:3000', 'https://menaoye-guesthouse.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

/**
 * Booking Endpoint - /send-email
 * Sends booking confirmations, etc.
 */
app.post('/send-email', (req, res) => {
  const { email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'New Booking Confirmation - Mena Oye',
    html: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Booking email error:', error);
      return res.status(500).send('Error sending booking email');
    }
    console.log('Booking email sent:', info.response);
    return res.status(200).send('Booking email sent');
  });
});

/**
 * Contact Form Endpoint - /contact-email
 * Sends contact form messages to you
 */
app.post('/contact-email', (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: email, 
    to: 'menaoye24@gmail.com', 
    subject: `New Contact from ${name}`,
    html: `
      <h3>New Message from Mena Oye Contact Form</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Contact form error:', error);
      return res.status(500).send('Error sending contact email');
    }
    console.log('Contact email sent:', info.response);
    return res.status(200).send('Contact message sent');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
