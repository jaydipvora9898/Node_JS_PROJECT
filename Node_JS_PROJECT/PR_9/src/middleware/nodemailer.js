require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (data) => {
  try {
    let info = await transporter.sendMail(data);
    console.log("Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};

module.exports = sendMail;
