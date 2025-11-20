const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Account = require("../models/account.model");
module.exports = {
  register : async (req, res) => {
    const { email, password, username, birthdate, mailText, mailHtml, mailSubject } = req.body;
    

    if (!email || !password || !username || !birthdate) {
      return res.status(400).json({ message: "Email, password, username and birth date are required" });
    }

    try {
      console.log("Registering user:", { email, username, birthdate });
      const saltRounds = parseInt(process.env.BCRYPT_SALT, 10); // Parse salt rounds as an integer
      const hashPassword = await bcrypt.hash(password, saltRounds); // Hash the password
      const account = new Account({ email, password: hashPassword, username, nickname: username, birthdate });
      await account.save();
      // Send mail to the user for email validation
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const parsedMailSubject = mailSubject.replace("{{username}}", username);
      const parsedMailText = mailText.replace("{{username}}", username).replace("{{link}}", `${process.env.FRONTEND_URL}/verify?token=${jwt.sign({ id: account._id }, process.env.EMAIL_JWT_KEY, { expiresIn: '1d' })}`);
      const parsedMailHtml = mailHtml.replace("{{username}}", username).replace("{{link}}", `${process.env.FRONTEND_URL}/verify?token=${jwt.sign({ id: account._id }, process.env.EMAIL_JWT_KEY, { expiresIn: '1d' })}`);

      console.log(mailText, mailHtml, mailSubject);
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, 
        to: email, 
        subject: parsedMailSubject,
        text: parsedMailText,
        html: parsedMailHtml 
      };
      await transporter.sendMail(mailOptions);
      // Respond with success message
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  },

  login: async (req, res) => {
    const { login, password } = req.body;
    if ((!login) || !password) {
        return res.status(400).json({ message: "Email or username and password are required" });
    }

    try {
      // Check if login is an email or username
      // If it contains '@', treat it as an email, otherwise treat it as a username
      let account;
      if (login.includes("@")) {
        account = await Account.findOne({ email: login });
      } else {
        account = await Account.findOne({ username: login });
      }

      // If no account found, return error
      if (!account) {
        return res.status(401).json({ message: "Invalid email or account or password" });
      }

      // If the account is not verified, return error
      if (!account.verified) {
          return res.status(403).json({ message: "Account not verified. Please check your email for verification link." });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = bcrypt.compare(password, account.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or account or password" });
      }

      // If the password matches, generate a JWT token
      const token = jwt.sign({ id: account._id, role: account.role }, process.env.ACCESS_JWT_KEY, { expiresIn: "1h" });
      // Set the token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Prevent CSRF attacks
        maxAge: 3600000 // 1 hour
      });
      res.status(200).json({ message: "Login successful", account: { id: account._id, username: account.username, role: account.role }});
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
  },

  logout: async (req, res) => {
    // Invalidate the token on the client side
    // This is a placeholder as JWTs are stateless and cannot be invalidated server-side
    // In future, we could implement a token blacklist or use a database to track active sessions
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
    });
    res.clearCookie('user', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
    });
    res.status(200).json({ message: "Logout successful" });
  },

  refreshToken: async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);
      // Generate a new token
      const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.ACCESS_JWT_KEY, { expiresIn: "1h" });
      res.status(200).json({ message: "Token refreshed successfully", token: newToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error });
    }
  },

  authenticate: async (req, res) => {
    const token = req.cookies.token // req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);
      const account = await Account.findById(decoded.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.status(200).json({ message: "Authenticated successfully", account });
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error });
    }
  },

  verifyAccount: async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.EMAIL_JWT_KEY);
      const account = await Account.findByIdAndUpdate(decoded.id, { verified: true }, { new: true });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error verifying account", error });
    }
  }
};