import express from "express";
import {
  registerUser,
  authenticateUser,
  verifyAuthOtp,
  resendOtp,
  resetPassword,
  logoutUser,
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleById,
  getAllUsers
} from "./auth-controller.js";
import { verifyToken } from "../utils/jwtInterceptor.js";

const router = express.Router();
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email, username, role, and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - role_id
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 */

router.post("/register", async (req, res) => {
  const result = await registerUser(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     description: Login using username and password to receive a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  const result = await authenticateUser(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     description: Verify the one-time password (OTP) sent to the user's email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */

router.post("/verify-otp", async (req, res) => {
  const result = await verifyAuthOtp(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     description: Send a new OTP to the user’s email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid email
 */

router.post("/resend-otp", async (req, res) => {
  const result = await resendOtp(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Allows a user to reset their password by providing their username and new password.
 *     tags: [Auth]   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error
 */

router.post("/reset-password", async (req, res) => {
  const result = await resetPassword(req);
  console.log(result);
  return res.status(result.statusCode).json(result);
});


/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the user by invalidating their session token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       

 */
router.post("/logout", verifyToken, async (req, res) => {
  const result = await logoutUser(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/role:
 *   post:
 *     summary: Create a new user role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin
 *               description:
 *                 type: string
 *                 example: Has full access to the system.
 *     responses:
 *       200:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role created successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request — Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error — name is required
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */
router.post("/role", async (req, res) => {
  const result = await createRole(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Roles retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Admin
 *                       description:
 *                         type: string
 *                         example: Has full access to the system.
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */
router.get("/roles", async (req, res) => {
  const result = await getRoles(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/role/get/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Admin
 *                     description:
 *                       type: string
 *                       example: Has full access to the system.
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */
router.get("/role/get/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getRoleById(id);
  return res.send(result);
});


/**
 * @swagger
 * /api/users/role/update:
 *   patch:
 *     summary: Update a role by ID
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Editor
 *               description:
 *                 type: string
 *                 example: Can edit and manage content.
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role updated successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Name field is required
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No role found with the given ID
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */
router.patch("/role/update", async (req, res) => {
  const result = await updateRole(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 * /api/users/role/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role deleted successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No role found with the given ID
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */
router.delete("/role/:id", async (req, res) => {
  const result = await deleteRole(req);
  return res.status(result.statusCode).json(result);
});

/**
 * @swagger
 *  /api/users/get-all-users:
 *   get:
 *     summary: Get all users
 *     description: Fetches and returns a list of all users from the system.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *       500:
 *         description: Server error.
 */
router.get("/get-all-users", async (req, res) => {
  const result = await getAllUsers();
  return res.send(result);
});


export default router;
