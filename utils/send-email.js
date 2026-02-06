import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587), // Changed default to 587
  secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true
  }
});

// Verify transporter configuration (non-blocking)
transporter
  .verify()
  .then(() => {
    console.log("✅ Gmail transporter ready");
    console.log(`📧 Email configured: ${process.env.SMTP_USER}`);
    console.log(`🔑 Password length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0}`);
  })
  .catch((err) => {
    console.error("❌ Transporter verification failed:", err.message);
    console.error(`Debug Info: Host=${process.env.SMTP_HOST}, Port=${process.env.SMTP_PORT}, User=${process.env.SMTP_USER}, PassLen=${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0}`);
    console.error("\n🔧 Troubleshooting steps:");
    console.error("1. Ensure 2-Factor Authentication is enabled on your Gmail account");
    console.error("2. Generate a new App Password at: https://myaccount.google.com/apppasswords");
    console.error("3. Update SMTP_PASS in .env with the 16-character password (no spaces)");
    console.error("4. Check if your server has picked up the latest .env changes (restart required if not using nodemon/dotenv correctly)");
  });

export async function sendEmail(req) {
  const logMsg = `\n[${new Date().toISOString()}] 📨 sendEmail called with: ${JSON.stringify(req)}`;
  try {
    fs.appendFileSync(path.join(process.cwd(), 'email-debug.log'), logMsg);
  } catch (e) { console.error('Failed to write to log file'); }

  console.log(logMsg);

  if (!req.to || !req.subject || !req.message) {
    const errorMsg = `\n[${new Date().toISOString()}] ❌ Missing fields`;
    try { fs.appendFileSync(path.join(process.cwd(), 'email-debug.log'), errorMsg); } catch (e) { }
    return {
      success: false,
      message: "to, subject, and message are required",
      status: 400,
    };
  }

  try {
    let emailHtml = `<p>${req.message}</p>`;

    // Try to load template if it exists
    try {
      const templatePath = path.join(process.cwd(), 'templates', 'general-email-template.html');
      let template = fs.readFileSync(templatePath, 'utf8');

      // Replace placeholders
      const title = req.title || "Notification";
      const bodyContent = req.htmlBody || `<p>${req.message}</p>`;

      template = template.replace('{{TITLE}}', title);
      template = template.replace('{{BODY_CONTENT}}', bodyContent);

      emailHtml = template;
    } catch (templateErr) {
      const warnMsg = `\n[${new Date().toISOString()}] ⚠️ Template error: ${templateErr.message}`;
      try { fs.appendFileSync(path.join(process.cwd(), 'email-debug.log'), warnMsg); } catch (e) { }
      console.warn("Could not load email template, falling back to simple HTML:", templateErr.message);
    }

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: req.to,
      subject: req.subject,
      text: req.message,
      html: emailHtml,
    });

    const successMsg = `\n[${new Date().toISOString()}] ✅ Email sent: ${info.response}`;
    try { fs.appendFileSync(path.join(process.cwd(), 'email-debug.log'), successMsg); } catch (e) { }
    console.log("Email sent:", info.response);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      status: 200,
    };
  } catch (error) {
    const failMsg = `\n[${new Date().toISOString()}] ❌ Email sending failed: ${error.message} \nStack: ${error.stack}`;
    try { fs.appendFileSync(path.join(process.cwd(), 'email-debug.log'), failMsg); } catch (e) { }
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
}