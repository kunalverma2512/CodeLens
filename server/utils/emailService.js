import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationOTP = async (email, otp) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your CodeLens Account</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333333; margin-bottom: 20px; }
        .message { font-size: 16px; color: #666666; line-height: 1.6; margin-bottom: 30px; }
        .otp-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 42px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; }
        .otp-label { font-size: 14px; color: rgba(255,255,255,0.9); margin-top: 10px; }
        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px; }
        .warning-text { font-size: 14px; color: #856404; margin: 0; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer-text { font-size: 14px; color: #6c757d; margin: 0; }
        .brand { font-weight: bold; color: #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to CodeLens</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello,</p>
          <p class="message">Thank you for signing up with CodeLens! To complete your registration and start tracking your coding journey, please verify your email address using the OTP below:</p>
          
          <div class="otp-container">
            <p class="otp-code">${otp}</p>
            <p class="otp-label">Your Verification Code</p>
          </div>
          
          <div class="warning">
            <p class="warning-text">This code will expire in 10 minutes. Do not share this code with anyone.</p>
          </div>
          
          <p class="message">If you didn't create an account with CodeLens, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p class="footer-text">Made with passion by the <span class="brand">CodeLens</span> Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"CodeLens" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your CodeLens Account",
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetOTP = async (email, otp) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your CodeLens Password</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333333; margin-bottom: 20px; }
        .message { font-size: 16px; color: #666666; line-height: 1.6; margin-bottom: 30px; }
        .otp-container { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 42px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; }
        .otp-label { font-size: 14px; color: rgba(255,255,255,0.9); margin-top: 10px; }
        .warning { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 25px 0; border-radius: 4px; }
        .warning-text { font-size: 14px; color: #721c24; margin: 0; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer-text { font-size: 14px; color: #6c757d; margin: 0; }
        .brand { font-weight: bold; color: #ff6b6b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello,</p>
          <p class="message">We received a request to reset your CodeLens password. Use the OTP below to proceed with resetting your password:</p>
          
          <div class="otp-container">
            <p class="otp-code">${otp}</p>
            <p class="otp-label">Your Password Reset Code</p>
          </div>
          
          <div class="warning">
            <p class="warning-text">This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email or contact support if you're concerned.</p>
          </div>
          
          <p class="message">For security reasons, never share this code with anyone. CodeLens support will never ask for your OTP.</p>
        </div>
        <div class="footer">
          <p class="footer-text">Made with passion by the <span class="brand">CodeLens</span> Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"CodeLens" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your CodeLens Password",
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};
