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

transporter
  .verify()
  .then(() => {
    console.log("Gmail transporter ready");
  })
  .catch((err) => console.error("Transporter error", err));

export async function sendEmail(req) {
  if (!req.to || !req.subject || !req.message) {
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
      console.warn("Could not load email template, falling back to simple HTML:", templateErr.message);
    }

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: req.to,
      subject: req.subject,
      text: req.message,
      html: emailHtml,
    });

    console.log("Email sent:", info.response);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      status: 200,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
}