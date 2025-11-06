import connection from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOtp, verifyOtp } from '../utils/otp-service.js';
import { sendEmail } from '../utils/send-email.js';
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//authenticate user
export async function authenticateUser(req) {
    const { username, password } = req.body;
    console.log('Authenticating user...', username);
    try {
        const [rows] = await connection.query('SELECT * FROM user WHERE username = ?', [username]);
        if (rows.length === 0) {
            return { message: "User not found", data: null, statusCode: 404 };
        }

        const user = rows[0];
        console.log('User found:', user);
        const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
        if (!isPasswordValid) {
            return { message: "Invalid credentials", data: null, statusCode: 401 };
        }

        if (user.is_logged_in) {
            return { message: "User already logged in from another device", data: null, statusCode: 403 };
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role_id: user.role_id },
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );


        const role = await getRoleById(user.role_id);
        const userData = {
            id: user.id,
            username: user.username,
            role_id: user.role_id,
            role_name: role.data?.role_name,
            token: token
        };
        const sendOtpResult = await sendOtp(user.email);
        if (!sendOtpResult.ok) {
            return {
                message: "Failed to send OTP",
                statusCode: sendOtpResult.statusCode || 500,
                data: null
            };
        }
        await connection.query(
            'UPDATE user SET session_token = ?, is_logged_in = TRUE WHERE id = ?',
            [token, user.id]
        );
        return {
            message: "Authentication successful, OTP sent to email",
            data: userData,
            statusCode: 200
        };

    } catch (err) {
        // console.error('Error in authenticateUser:', err.message);
        return {
            message: err.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}
//register user
export async function registerUser(req) {
    const { username, password, email, role_id } = req.body;
    try {
        const existingUser = await connection.query(
            'SELECT * FROM user WHERE username = ?',
            [username]
        );

        if (existingUser[0].length > 0) {
            return {
                message: "Username already taken",
                data: null,
                statusCode: 409
            };
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        const result = await connection.query(
            'INSERT INTO user (username, password, email, role_id) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, role_id]
        );

        const response = await sendEmail({
            to: email,
            subject: '🌟 Welcome to Our Community!',
            message: `Hello ${username},\n\nWe’re absolutely thrilled
             to have you on board! 🎉\n\nYour registration was successful 💫 \n\n\n\n\n\n\nn\n\n

             Login credentials:\n\n\n
             Username: ${username}\n\n\n
             Password: ${password} \n\n\n
             `
        });
        return {
            message: "User registered successfully",
            data: { id: result[0].insertId },
            statusCode: 201
        };
    } catch (err) {
        // console.error('Error in registerUser:', err.message);
        if (err.code === 'ER_DUP_ENTRY') {
            return {
                message: "Email already registered",
                data: null,
                statusCode: 409
            };
        }
        return {
            message: err.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//get user by id
export async function getUserById(id) {
    try {
        const result = await connection.query(
            'SELECT id, username, email, role_id FROM user WHERE id = ?',
            [id]
        );

        if (result[0].length > 0) {
            return {
                message: "User found",
                data: result[0][0],
                statusCode: 200
            };
        } else {
            return {
                message: "User not found",
                data: null,
                statusCode: 404
            };
        }
    } catch (err) {
        // console.error('Error in getUserById:', err.message);
        return {
            message: err.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//get all users
export async function getAllUsers() {
    try {
        const result = await connection.query(
            'SELECT id, username, email, role_id FROM user'
        );
        return {
            message: "Users fetched successfully",
            data: result[0],
            statusCode: 200
        };
    } catch (err) {
        // console.error('Error in getAllUsers:', err.message);
        return {
            message: err.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//create role
export async function createRole(name) {
    try {
        const result = await connection.query('INSERT INTO role (role_name) VALUES (?)', [name]);
        return {
            message: "Role created successfully",
            data: { id: result[0].insertId },
            statusCode: 201
        };
    } catch (error) {
        // console.error('Error in createRole:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                message: "Role already exists",
                data: null,
                statusCode: 409
            };
        }
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//get role by id
export async function getRoleById(id) {
    try {
        const result = await connection.query(
            'SELECT * FROM role WHERE id = ?',
            [id]
        ); if (result[0].length > 0) {
            return {
                message: "Role found",
                data: result[0][0],
                statusCode: 200
            };
        }
        else {
            return {
                message: "Role not found",
                data: null,
                statusCode: 404
            };
        }
    } catch (error) {
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//verify otp
export async function verifyAuthOtp(req) {
    try {
        const result = await verifyOtp(req);
        console.log('OTP verification result:', result);
        return result;
    } catch (error) {
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//reset password
export async function resetPassword(req) {
    const { username, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

        await connection.query(
            'UPDATE user SET password = ? WHERE username = ?',
            [hashedPassword, username]
        );

        return {
            message: "Password reset successfully",
            data: null,
            statusCode: 200
        };

    } catch (error) {
        return {
            message: error.sqlMessage?.split(':')[0].trim() || "Something went wrong",
            data: null,
            statusCode: 500
        };
    }
}
//resend otp
export async function resendOtp(req) {
    const { email } = req.body;
    try {
        const sendOtpResult = await sendOtp(email);
        if (!sendOtpResult.ok) {
            return {
                message: "Failed to send OTP",
                statusCode: sendOtpResult.statusCode || 500,
                data: null
            };
        }
        return sendOtpResult;
    } catch (error) {
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//logout user
export async function logoutUser(req) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return { message: "Token missing", statusCode: 401, data: null };
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const userId = decoded.id;

        await connection.query(
            `UPDATE user 
             SET session_token = NULL, is_logged_in = 0 
             WHERE id = ? AND session_token = ?`,
            [userId, token]
        );

        return {
            message: "Logout successful",
            data: null,
            statusCode: 200
        };

    } catch (err) {
        console.log(err);

        return {
            message: err.sqlMessage.split(':')[0].trim() ,
            statusCode: 401,
            data: null
        };
    }
}



