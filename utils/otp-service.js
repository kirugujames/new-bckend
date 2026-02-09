import { randomInt } from 'crypto';
import { sendEmail } from './send-email.js';

/**
 * Generate a 6-digit OTP code
 * @returns {string} 6-digit OTP
 */
export function generateOTP() {
    return randomInt(100000, 999999).toString();
}

/**
 * Calculate OTP expiry time (5 minutes from now)
 * @returns {Date} Expiry timestamp
 */
export function getOTPExpiry() {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    return expiry;
}

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} purpose - Purpose of OTP (verification/cancellation)
 * @param {string} firstName - Member's first name
 * @returns {Promise<Object>} Email sending result
 */
export async function sendOTPEmail(email, otp, purpose, firstName = 'Member') {
    const purposeText = purpose === 'verification'
        ? 'verify your membership'
        : 'cancel your membership';

    const subject = `Your OTP Code - ${purpose === 'verification' ? 'Membership Verification' : 'Membership Cancellation'}`;

    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${firstName},</h2>
      <p>You have requested to ${purposeText}.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code:</p>
        <h1 style="margin: 10px 0; color: #2196F3; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
        <p style="margin: 0; font-size: 12px; color: #999;">This code will expire in 5 minutes</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        If you did not request this, please ignore this email or contact support.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        This is an automated message from Shikana Frontliner Party. Please do not reply to this email.
      </p>
    </div>
  `;

    const message = `Hello ${firstName},\n\nYour OTP code to ${purposeText} is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`;

    return await sendEmail({
        to: email,
        subject,
        message,
        htmlBody,
        title: subject
    });
}

/**
 * Verify OTP code
 * @param {Object} member - Member object from database
 * @param {string} otp - OTP code to verify
 * @returns {Object} Verification result
 */
export function verifyOTP(member, otp) {
    if (!member.otp_code) {
        return {
            valid: false,
            message: 'No OTP found. Please request a new OTP.'
        };
    }

    if (member.otp_code !== otp) {
        return {
            valid: false,
            message: 'Invalid OTP code. Please check and try again.'
        };
    }

    const now = new Date();
    if (now > new Date(member.otp_expires_at)) {
        return {
            valid: false,
            message: 'OTP has expired. Please request a new OTP.'
        };
    }

    return {
        valid: true,
        message: 'OTP verified successfully'
    };
}

/**
 * Clear OTP data from member record
 * @param {Object} member - Member object from database
 * @returns {Promise<void>}
 */
export async function clearOTP(member) {
    await member.update({
        otp_code: null,
        otp_expires_at: null,
        otp_verified: false
    });
}