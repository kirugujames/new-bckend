import express from "express";
import { body, validationResult } from "express-validator";
import {
  getAllMembers,
  registerMember,
  getMember,
  getMemberByIdNo,
  deleteMember,
  updateMember,
  cancelMembership,
  verifyMemberExistence,
} from "./register-controller.js";
import dotenv from "dotenv";
import { verifyToken } from "../utils/jwtInterceptor.js";
import { auditMiddleware } from "../utils/audit-service.js";

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
  body("Constituency").notEmpty().withMessage("Constituency is required"),
  body("ward").notEmpty().withMessage("Ward is required"),
  body("county").notEmpty().withMessage("County is required"),
  body("area_of_interest").optional(),
  body("membershipStatus").optional(),
  body("verificationMethod").optional(),
];

const validateUpdate = [
  body("id").notEmpty().withMessage("ID is required"),
  body("first_name").optional(),
  body("last_name").optional(),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("dob").optional(),
  body("gender").optional(),
  body("phone").optional(),
  body("idNo").optional(),
  body("Constituency").optional(),
  body("ward").optional(),
  body("county").optional(),
  body("area_of_interest").optional(),
  body("religion").optional(),
  body("ethnicity").optional(),
  body("postalAddress").optional(),
  body("postalCode").optional(),
  body("isPWD").optional(),
  body("ncpwdNumber").optional(),
  body("pollingStation").optional(),
  body("streetVillage").optional(),
  body("membershipStatus").optional(),
  body("specialInterest").optional(),
  body("membershipNumber").optional(),
  body("localLeader").optional(),
  body("verificationCode").optional(),
  body("politicalDeclaration").optional(),
  body("termsConsent").optional(),
  body("verificationMethod").optional(),
  body("membershipType").optional(),
  body("paymentMethod").optional(),
  body("paymentPhoneNumber").optional(),
  body("amount").optional(),
];

const validateCancellation = [
  body("memberId").notEmpty().withMessage("Member ID is required"),
  body("nationalId").notEmpty().withMessage("National ID is required"),
  body("hasConsent").isBoolean().withMessage("Consent is required (true/false)"),
];

const validateExistence = [
  body("idNo").notEmpty().withMessage("National ID is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("hasConsent").isBoolean().withMessage("Consent is required (true/false)"),
];

/**
 * @swagger
 * /api/members/register/member:
 *   post:
 *     summary: Register a new member
 *     description: Registers a member and creates a linked user login account
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
 *               - idNo
 *               - username
 *               - role_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@email.com
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1995-08-15
 *               gender:
 *                 type: string
 *                 example: Male
 *               phone:
 *                 type: string
 *                 example: "+254712345678"
 *               idNo:
 *                 type: string
 *                 example: "12345678"
 *               doc_type:
 *                 type: string
 *                 example: National ID
 *               Constituency:
 *                 type: string
 *                 example: Langata
 *               ward:
 *                 type: string
 *                 example: Karen
 *               county:
 *                 type: string
 *                 example: Nairobi
 *               area_of_interest:
 *                 type: string
 *                 example: Agriculture
 *               religion:
 *                 type: string
 *                 example: Christianity
 *               ethnicity:
 *                 type: string
 *                 example: Kikuyu
 *               postalAddress:
 *                 type: string
 *                 example: "P.O. Box 123"
 *               postalCode:
 *                 type: string
 *                 example: "00100"
 *               isPWD:
 *                 type: boolean
 *                 example: false
 *               ncpwdNumber:
 *                 type: string
 *               pollingStation:
 *                 type: string
 *               streetVillage:
 *                 type: string
 *               membershipStatus:
 *                 type: string
 *                 example: new
 *               specialInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Youths", "Minority Group"]
 *               membershipNumber:
 *                 type: string
 *               localLeader:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *               politicalDeclaration:
 *                 type: boolean
 *                 example: true
 *               termsConsent:
 *                 type: boolean
 *                 example: true
 *               verificationMethod:
 *                 type: string
 *                 example: email
 *               membershipType:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               paymentPhoneNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *               username:
 *                 type: string
 *                 example: johndoe
 *               role_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Member registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     member_code:
 *                       type: string
 *                       example: MEM-2025-0012
 *       409:
 *         description: Duplicate email, phone number, or ID number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already registered
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.post("/register/member", auditMiddleware("MEMBER_REGISTER"), validateRegistration, async (req, res) => {
  console.log("my request create", req.body)
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
 * /api/members/get/member/idno/{idNo}:
 *   get:
 *     summary: Get a specific member by National ID
 *     description: Fetch a member's details by their National ID Number
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: idNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The member's National ID
 *     responses:
 *       200:
 *         description: Member found
 *       404:
 *         description: Member not found
 */
router.get("/get/member/idno/:idNo", auditMiddleware("MEMBER_GET_BY_IDNO"), async (req, res) => {
  const idNo = req.params.idNo;
  const results = await getMemberByIdNo(idNo);
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
router.delete("/delete/member/:id", verifyToken, auditMiddleware("MEMBER_DELETE"), async (req, res) => {
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
router.patch("/update/member/:id", verifyToken, auditMiddleware("MEMBER_UPDATE"), validateUpdate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const memberId = req.params.id;
  const results = await updateMember(req, memberId);
  return res.send(results);
});

/**
 * @swagger
 * /api/members/cancel/membership:
 *   post:
 *     summary: Cancel membership
 *     description: Cancels a membership after verifying member ID and National ID
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *               - nationalId
 *               - hasConsent
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: SFUP-123
 *               nationalId:
 *                 type: string
 *                 example: "234566645"
 *               hasConsent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Membership cancelled successfully
 *       400:
 *         description: Missing fields or consent not given
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
router.post("/cancel/membership", auditMiddleware("MEMBER_CANCEL_MEMBERSHIP"), validateCancellation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const results = await cancelMembership(req);
  return res.status(results.statusCode || 200).send(results);
});

/**
 * @swagger
 * /api/members/verify/existence:
 *   post:
 *     summary: Verify member existence
 *     description: Checks if a member exists based on National ID and phone number
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idNo
 *               - phone
 *               - hasConsent
 *             properties:
 *               idNo:
 *                 type: string
 *                 example: "12345678"
 *               phone:
 *                 type: string
 *                 example: "+254712345678"
 *               hasConsent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Member found
 *       400:
 *         description: Missing fields or consent not given
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
router.post("/verify/existence", auditMiddleware("MEMBER_VERIFY_EXISTENCE"), validateExistence, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const results = await verifyMemberExistence(req);
  return res.status(results.statusCode || 200).send(results);
});

export default router;
