import express from "express";
import { body, validationResult } from "express-validator";
import { registerUser, authenticateUser, resendOtp, verifyAuthOtp,resetPassword,logoutUser } from "./auth-controller.js";
import dotenv from "dotenv";
import { verifyToken } from "../utils/jwtInterceptor.js";


dotenv.config();

const router = express.Router();

// Register validation rules
const validateRegistration = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("role_id").isInt().withMessage("Role ID must be an integer"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

// Login validation rules
const validateLogin = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
// OTP validation rules
const validateOtp = [
    body("email").isEmail().withMessage("email should be valid"),
    body("otp")
        .isLength({ min: 6 })
        .withMessage("otp must be 6 characters"),
];

const resetPasswordValidate = [
    body("username").notEmpty().withMessage("email should be valid"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("password must be 6 characters"),
];

//resend OTP validation rules
const validateOtpResend = [
    body("email").isEmail().withMessage("email should be valid")
];

//register route
router.post("/register", validateRegistration, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const results = await registerUser(req);
    return res.send(results);
});

//login route
router.post("/login", validateLogin, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const result = await authenticateUser(req);
    return res.send(result);

});

//verify OTP route can be added here
router.post("/verify-otp", validateOtp, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const result = await verifyAuthOtp(req);
    console.log('Sending OTP verification response:', result);
    return res.status(result.statusCode || 500).send(result);
});

//resend OTP route can be added here
router.post("/resend-otp", validateOtpResend, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const result = await resendOtp(req);
    return res.status(result.statusCode || 500).send(result);

});

router.post("/reset/password", resetPasswordValidate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const result = await resetPassword(req);
    return res.send(result);
});

router.post("/logout", verifyToken, async (req, res) => {
    const result = await logoutUser(req);
    return res.send(result);
});
export default router;
