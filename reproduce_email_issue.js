import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('--- Email Debug Script ---');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
// Do not log the full password
console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: true
    }
});

transporter.verify()
    .then(async () => {
        console.log('✅ Connection verification successful!');

        console.log('Attempting to send test email...');
        try {
            const info = await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: process.env.SMTP_USER, // Send to self
                subject: 'Test Email from Debug Script',
                text: 'If you receive this, email sending is working correctly.',
            });
            console.log('✅ Test email sent:', info.messageId);
            process.exit(0);
        } catch (sendErr) {
            console.error('❌ Failed to send test email:', sendErr);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error('❌ Connection verification failed!');
        console.error('Error code:', err.code);
        console.error('Error response:', err.response);
        console.error('Full Error:', err);
        process.exit(1);
    });
