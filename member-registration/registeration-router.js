import express from "express";
import { body, validationResult } from "express-validator";
import {
  getAllMembers,
  registerMember,
  getMember,
  deleteMember,
  updateMember,
} from "./register-controller.js";
import dotenv from "dotenv";
import { verifyToken } from "../utils/jwtInterceptor.js";

dotenv.config();
const router = express.Router();

// Validation rules
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
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("area_of_interest").notEmpty().withMessage("Area of interest is required"),
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
  body("area_of_interest").notEmpty().withMessage("Area of interest is required"),
];

/**
 * @swagger
 * /api/members/register/member:
 *   post:
 *     summary: Register a new member
 *     description: Creates a new member record in the system
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               idNo:
 *                 type: string
 *               consituency:
 *                 type: string
 *               ward:
 *                 type: string
 *               county:
 *                 type: string
 *               password:
 *                 type: string
 *               area_of_interest:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member successfully registered
 *       400:
 *         description: Validation error
 */
router.post("/register/member", validateRegistration, async (req, res) => {
  console.log("my request create",  req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const results = await registerMember(req);
  return res.send(results);
});

/** 
 * @swagger
 * /api/members/get/all:
 *   get:
 *     summary: Get all registered members
 *     description: Returns a list of all members (requires authentication)
 *     tags: [Member]
 *     responses:
 *       200:
 *         description: A list of members
 */
router.get("/get/all", verifyToken, async (req, res) => {
  const results = await getAllMembers();
  return res.send(results);
});

/**
 * @swagger
 * /api/members/get/member/{id}:
 *   get:
 *     summary: Get a specific member
 *     description: Fetch a member's details by ID
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The member ID
 *     responses:
 *       200:
 *         description: Member found
 *       404:
 *         description: Member not found
 */
router.get("/get/member/:id", async (req, res) => {
  const memberId = req.params.id;
  const results = await getMember(memberId);
  return res.send(results);
});

/**
 * @swagger
 * /api/members/delete/member/{id}:
 *   delete:
 *     summary: Delete a member
 *     description: Removes a member record by ID
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 */
router.delete("/delete/member/:id", async (req, res) => {
  const memberId = req.params.id;
  const results = await deleteMember(memberId);
  return res.send(results);
});

/**
 * @swagger
 * /api/members/update/member/{id}:
 *   patch:
 *     summary: Update member information
 *     description: Updates the specified fields of an existing member
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               area_of_interest:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 */
router.patch("/update/member/:id", validateUpdate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const memberId = req.params.id;
  const results = await updateMember(req, memberId);
  return res.send(results);
});

export default router;
