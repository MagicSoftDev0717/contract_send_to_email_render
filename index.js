// import express from "express";
// import sgMail from "@sendgrid/mail";
// import cors from "cors";
// import dotenv from "dotenv"; // For loading .env variables


const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const dotenv = require('dotenv');
Load environment variables
dotenv.config();

// Initialize SendGrid with API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create an instance of Express
const app = express();

// Enable CORS for your frontend domain (You can adjust this as needed)
app.use(cors({ origin: "https://www.correctthecontract.com" }));

// Middleware to parse JSON bodies
app.use(express.json());

// Preflight CORS handling (for OPTIONS request)
app.options("*", cors({ origin: "https://www.correctthecontract.com" }));

// POST endpoint to send the contract email
app.post("/sendContractToLabel", async (req, res) => {
  const { artistEmail, labelEmail, pdfBase64, fileName } = req.body;

  // Check if required fields are provided
  if (!artistEmail || !labelEmail || !pdfBase64 || !fileName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const msg = {
    to: labelEmail,
    from: "darrensdesign01@gmail.com",
    cc: artistEmail,
    subject: "New Artist Contract for Review",
    html: `
      <p>Hello,</p>
      <p>You’ve received a contract proposal from <b>${artistEmail}</b>.</p>
      <p>Please review the attached contract and respond accordingly.</p>
    `,
    attachments: [
      {
        content: pdfBase64,
        filename: fileName,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    // Send the email using SendGrid
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("SendGrid error:", error.response && error.response.body ? error.response.body : error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Set up the server to listen on port 3000 (Render will use this for deployment)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
