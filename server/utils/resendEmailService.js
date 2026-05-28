import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================
// SEND OTP EMAIL
// =========================
export const sendVerificationOTP = async (email, otp) => {
  await resend.emails.send({
    from: "CodeLens <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires soon.</p>
    `,
  });
};

// =========================
// PASSWORD RESET OTP
// =========================
export const sendPasswordResetOTP = async (email, otp) => {
  await resend.emails.send({
    from: "CodeLens <onboarding@resend.dev>",
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>If this wasn't you, ignore this email.</p>
    `,
  });
};