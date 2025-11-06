import express from "express";
import { body, validationResult } from "express-validator";
import { getAllMembers, registerMember, getMember, deleteMember,updateMember } from "./register-controller.js";
import dotenv from "dotenv";
import { verifyToken } from "../utils/jwtInterceptor.js";


dotenv.config();

const router = express.Router();

// Register for  members validation rules
const validateRegistration = [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("idNo").notEmpty().withMessage("National ID is required"),
    body("consituency").notEmpty().withMessage("Constituency is required"),
    body("ward").notEmpty().withMessage("Ward is required"),
    body("county").notEmpty().withMessage("County is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("area_of_interest").notEmpty().withMessage("Area of interest is required")
];

const validateUpdate = [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("idNo").notEmpty().withMessage("National ID is required"),
    body("consituency").notEmpty().withMessage("Constituency is required"),
    body("ward").notEmpty().withMessage("Ward is required"),
    body("county").notEmpty().withMessage("County is required"),
    body("area_of_interest").notEmpty().withMessage("Area of interest is required")
];
router.post("/register/member", validateRegistration, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const results = await registerMember(req);
    return res.send(results);
});

router.get("/get/all", verifyToken, async (req, res) => {
    const results = await getAllMembers();
    return res.send(results);
});

router.get("/get/member/:id", async (req, res) => {
    const memberId = req.params.id;
    const results = await getMember(memberId);
    return res.send(results);
});

router.delete("/delete/member/:id", async (req, res) => {
    const memberId = req.params.id;
    const results = await deleteMember(memberId);
    return res.send(results);
}
);

router.patch("/update/member/:id", validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const memberId = req.params.id;
    const results = await updateMember(req, memberId);
    return res.send(results);
}
);

export default router;
