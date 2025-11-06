import e from 'express';
import { registerUser } from '../auth/auth-controller.js';
import connection from '../database.js';
import dotenv from 'dotenv';
dotenv.config();

// register member
export async function registerMember(req) {
    const {
        first_name,
        last_name,
        email,
        dob,
        gender,
        phone,
        idNo,
        consituency,
        ward,
        county,
        area_of_interest,
        username,
        password,
        role_id
    } = req.body;

    const member_code = generateMemberCode();

    try {
        const sql = `
            INSERT INTO memberRegistration 
            (first_name, last_name, email, dob, gender, phone, idNo, consituency, ward, county, area_of_interest, member_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            first_name,
            last_name,
            email,
            dob,
            gender,
            phone,
            idNo,
            consituency,
            ward,
            county,
            area_of_interest,
            member_code
        ];

        const [result] = await connection.query(sql, values);
        const response = await registerUser(req);
        console.log("User registration response:", response);

        return {
            message: "Member registered successfully",
            data: { id: result.insertId, member_code },
            statusCode: 201
        };

    } catch (error) {
        console.error("Register Error:", error);

        if (error.code === 'ER_DUP_ENTRY') {
            return {
                message: "Email already registered",
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

//get all  members
export async function getAllMembers() {
    try {
        const result = await connection.query(
            'SELECT * FROM memberRegistration'
        );
        return {
             message: "Members fetched successfully",
            data: result[0],
            statusCode: 200
        };
    } catch (error) {
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}

//get member by id
export async function getMember(id) {
    try {
        const result = await connection.query(
            'SELECT * FROM memberRegistration WHERE id = ?',
            [id]
        );
        return {
            message: "Member fetched successfully",
            data: result[0],
            statusCode: 200
        };
    } catch (error) {
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }
}
//delete member by id
export async function deleteMember(id) {
    try {
        const memberData  =  await getMember(id);
        if(memberData.data.length === 0){
            return {
                message: "Member not found",
                data: null,
                statusCode: 404
            };
        }
        const result = await connection.query("DELETE FROM memberRegistration WHERE id = ?", [id]);
        return {
            message: "Member deleted successfully",
            data: null,
            statusCode: 200
        };
    } catch (error) {
        
        return {
            message: error.sqlMessage.split(':')[0].trim() || "could not delete member",
            data: null,
            statusCode: 500
        };
    }
}

//update member by id
export async function updateMember(req) {
    try {
        const {
            first_name,
            last_name,
            email,
            dob,
            gender,
            phone,
            idNo,
            consituency,
            ward,
            county,
            area_of_interest,
            id
        } = req.body;
        const result = await connection.query(
            `UPDATE memberRegistration SET first_name = ?, last_name = ?, email = ?, dob = ?, gender = ?, phone = ?, idNo = ?, consituency = ?, ward = ?, county = ?, area_of_interest = ? WHERE id = ?`,
            [first_name, last_name, email, dob, gender, phone, idNo, consituency, ward, county, area_of_interest, id]
        );
        return {
            message: "Member updated successfully",
            data: null,
            statusCode: 200
        };

    } catch (error) {
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
            return {
                message: error.sqlMessage.split(':')[0].trim(),
                data: null,
                statusCode: 400
            }
                ;
        }
        return {
            message: error.sqlMessage.split(':')[0].trim(),
            data: null,
            statusCode: 500
        };
    }


}
//generate member cod
function generateMemberCode() {
    const prefix = 'MEB';
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNumber}`;
}
