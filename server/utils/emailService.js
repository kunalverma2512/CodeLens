import axios from "axios";
import "dotenv/config";

// ── Brevo Transactional Email API ─────────────────────────────────────────────
//
// Why API instead of SMTP?
//   - No SMTP credentials to manage or rotate
//   - Immune to IPv6 ENETUNREACH errors that plagued the nodemailer setup
//   - No connection pooling, greylisting, or port-blocking issues
//   - Single HTTP POST — simpler, faster, and more reliable on any host
//
// Required env vars:
//   BREVO_API_KEY      — from Brevo dashboard → SMTP & API → Generate API key
//   BREVO_SENDER_EMAIL — verified sender address in your Brevo account
//   BREVO_SENDER_NAME  — display name shown in recipient's inbox (optional, defaults to "CodeLens")
//
// Brevo API reference: https://developers.brevo.com/reference/send-transac-email

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Read once at startup — avoids repeated process.env lookups per request
const BREVO_API_KEY     = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME  = process.env.BREVO_SENDER_NAME || "CodeLens";

// ── Internal helper — all sends go through here ───────────────────────────────
const sendEmail = async ({ to, subject, htmlContent }) => {
  // Guard: fail fast with readable messages if env is missing
  if (!BREVO_API_KEY) {
    throw new Error("[emailService] BREVO_API_KEY is not set. Add it to server/.env");
  }
  if (!BREVO_SENDER_EMAIL) {
    throw new Error("[emailService] BREVO_SENDER_EMAIL is not set. Add it to server/.env");
  }

  // Brevo API payload — matches POST /v3/smtp/email schema exactly
  const payload = {
    sender: {
      name:  BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL
    },
    to: [{ email: to }],   // 'to' must be an array of objects per Brevo docs
    subject,
    htmlContent
  };

  console.log(`[emailService] Sending "${subject}" to ${to} via Brevo API`);

  await axios.post(BREVO_API_URL, payload, {
    headers: {
      "api-key":      BREVO_API_KEY,   // Brevo auth header — NOT "Authorization: Bearer"
      "Content-Type": "application/json"
    }
  });

  console.log(`[emailService] Email delivered successfully to ${to}`);
};

// ── Public exports (same signatures as before — auth/service.js unchanged) ────

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

  await sendEmail({
    to: email,
    subject: "Verify Your CodeLens Account",
    htmlContent
  });
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

  await sendEmail({
    to: email,
    subject: "Reset Your CodeLens Password",
    htmlContent
  });
};
