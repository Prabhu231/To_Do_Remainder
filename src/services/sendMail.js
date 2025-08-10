import nodemailer from "nodemailer";
import config from "dotenv";

config.config();

let transporter = nodemailer.createTransport({
  service: "gmail", // You can use SMTP settings for other providers
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 2. Set up email data
let mailOptions = {
  from: '"Prabhu" <your-email@gmail.com>', // sender address
  to: "recipient@example.com", // list of receivers
  subject: "Hello from Node.js",
  text: "This is a plain text body",
  html: "<b>This is an HTML body</b>",
};

// 3. Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error:", error);
  }
  console.log("Message sent:", info.messageId);
});
