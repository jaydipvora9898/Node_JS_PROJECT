


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: "yogeshrd1708@gmail.com",   
    pass: "nekjhyolynfthzeh",        
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

const sendMail = async (data) => {
  try {
    let info = await transporter.sendMail(data);
    console.log("Email sent: ", info.response);
    return info;
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};

module.exports = sendMail;

