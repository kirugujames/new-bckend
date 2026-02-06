import express from 'express';
import { sendEmail } from '../utils/send-email.js';

const router = express.Router();

/**
 * @swagger
 * /api/test/send-email:
 *   post:
 *     tags:
 *       - Test
 *     summary: Test email sending
 *     description: Send a test email to verify email configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 example: test@example.com
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Failed to send email
 */
router.post('/send-email', async (req, res) => {
    try {
        const { to } = req.body;

        if (!to) {
            return res.status(400).json({
                message: 'Email address is required',
                statusCode: 400,
                data: null
            });
        }

        console.log(`Attempting to send test email to: ${to}`);

        const result = await sendEmail({
            to: to,
            subject: 'Test Email from Backend',
            message: 'This is a test email to verify email configuration is working correctly.'
        });

        console.log('Email send result:', result);

        if (result.success) {
            return res.status(200).json({
                message: 'Test email sent successfully',
                statusCode: 200,
                data: result
            });
        } else {
            return res.status(500).json({
                message: 'Failed to send email',
                statusCode: 500,
                data: result
            });
        }
    } catch (error) {
        console.error('Test email error:', error);
        return res.status(500).json({
            message: error.message,
            statusCode: 500,
            data: null
        });
    }
});

export default router;
