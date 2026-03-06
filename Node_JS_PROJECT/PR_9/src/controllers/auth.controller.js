const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../middleware/nodemailer")
const User = require("../models/User.model");

exports.register = async (req, res) => {
  try {
    const { email, role, password, name } = req.body;
    let user = req.user; 

    const existUser = await User.findOne({ email : email, isDelete: false });
    if (existUser) {
      return res.json({ status: 400, message: "User already exists!" });
    }

    if (role === "admin" && user && user.role !== "admin") {
      return res.json({ status: 403, message: "Only admin can add admin" });
    }

    if (role === "manager" && (!user || user.role !== "admin")) {
      return res.json({ status: 403, message: "Only admin can add manager" });
    }
    
    if (role === "employee" && (!user || (user.role !== "admin" && user.role !== "manager"))) {
      return res.json({ status: 403, message: "Only admin/manager can add employee" });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${role}_profile/${req.file.filename}`;
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user = await User.create({ ...req.body, profileImg: imagePath, password: hashPassword});


    await sendMail({
        from: process.env.EMAIL_USER,          
        to: email,                  
        subject: "Your Employee Account Created",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
                padding: 20px;
              }
              
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              
              .email-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
              }
              
              .email-header h1 {
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 10px;
              }
              
              .email-header p {
                font-size: 16px;
                opacity: 0.9;
              }
              
              .email-body {
                padding: 40px 30px;
              }
              
              .welcome-section {
                text-align: center;
                margin-bottom: 30px;
              }
              
              .welcome-icon {
                font-size: 48px;
                margin-bottom: 15px;
              }
              
              .welcome-section h2 {
                color: #2d3748;
                font-size: 24px;
                margin-bottom: 10px;
              }
              
              .credentials-box {
                background: #f7fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
              }
              
              .credential-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e2e8f0;
              }
              
              .credential-item:last-child {
                border-bottom: none;
              }
              
              .credential-label {
                font-weight: 600;
                color: #4a5568;
              }
              
              .credential-value {
                color: #2d3748;
                font-family: 'Courier New', monospace;
                background: #edf2f7;
                padding: 4px 8px;
                border-radius: 4px;
              }
              
              .security-alert {
                background: #fff5f5;
                border: 1px solid #fed7d7;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
              }
              
              .security-alert p {
                color: #c53030;
                font-weight: 600;
                margin: 0;
              }
              
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s ease;
              }
              
              .cta-button:hover {
                transform: translateY(-2px);
              }
              
              .email-footer {
                background: #f7fafc;
                padding: 20px;
                text-align: center;
                color: #718096;
                font-size: 14px;
                border-top: 1px solid #e2e8f0;
              }
              
              @media (max-width: 600px) {
                .email-body {
                  padding: 30px 20px;
                }
                
                .credential-item {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 8px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h1>Welcome Aboard! 🎉</h1>
                <p>Your ${role}Account is Ready</p>
              </div>
              
              <div class="email-body">
                <div class="welcome-section">
                  <div class="welcome-icon">👋</div>
                  <h2>Hello ${name || "Employee"}!</h2>
                  <p>We're excited to have you on board as a Employee. Your account has been successfully created and you're all set to get started.</p>
                </div>
                
                <div class="credentials-box">
                  <div class="credential-item">
                    <span class="credential-label">Email Address:</span>
                    <span class="credential-value">${email}</span>
                  </div>
                  <div class="credential-item">
                    <span class="credential-label">Temporary Password:</span>
                    <span class="credential-value">${password}</span>
                  </div>
                </div>
                
                <div class="security-alert">
                  <p>⚠️ Security Notice: Please change your password immediately after first login</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="#" class="cta-button">Access Your Account</a>
                  <p style="color: #718096; margin-top: 15px;">
                    You can log in using the credentials above and start managing your tasks right away.
                  </p>
                </div>
              </div>
              
              <div class="email-footer">
                <p>If you have any questions, please contact our support team.</p>
                <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    return res.json({ status: 200, message: `${role} registered successfully!`, user });
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, message: "Server Error" });
  }
};



exports.login = (role) => {
  return async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email : email, isDelete: false });
      if (!user) {
        return res.json({ status: 404, message: "User not found" });
      }

      if (user.role !== role) {
        return res.json({ status: 401, message: `Only ${role} login allowed` });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.json({ status: 400, message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY,{ expiresIn: "1d" });

      return res.json({  status: 200, message: `${role} login successful`,token});
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Server Error" });
    }
  };
};

