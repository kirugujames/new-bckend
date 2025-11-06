import jwt from 'jsonwebtoken';
import connection from './../database.js';
import e from 'express';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function verifyToken(req, res, next) {
  // console.log('Verifying token...', req.headers);
  const token = req.headers['authorization']?.split(' ')[1];
  // console.log('Extracted Token:', token);

  if (!token) {
    const response = {
      message: 'Token is required',
      data: null,
      statusCode: 403,
    };
    return res.status(403).send(response);
  }

  jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err);
      if (err.name === 'TokenExpiredError') {
        try {
          const decodedExpired = jwt.decode(token);
          if (decodedExpired?.id) {
            await connection.query(
              'UPDATE user SET is_logged_in = FALSE, session_token = NULL WHERE id = ?',
              [decodedExpired.id]
            );
            // console.log(`User ${decodedExpired.username} session expired — marked as logged out.`);
          }
        } catch (dbErr) {
          // console.error('Error updating user status on token expiry:', dbErr.message);
        }

        const response = {
          message: 'Session expired. Please log in again.',
          data: null,
          statusCode: 401,
        };
        return res.status(401).send(response);
      }

      const response = {
        message: err.message,
        data: null,
        statusCode: 401,
      };
      return res.status(401).send(response);
    }
   const response =   await connection.query(
      'Select session_token  from user WHERE id = ?',
      [decoded.id]
    );
    if(response[0][0].session_token == null){
        const response = {
        message: "invalid session. Please log in again.",
        data: null,
        statusCode: 401,
      }; 
      return res.status(401).send(response);
    }
    req.user = decoded;
    next();
  });
}
