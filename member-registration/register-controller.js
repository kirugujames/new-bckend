import dotenv from "dotenv";
import MemberRegistration from "./models/memberRegistration.js";
import { registerUser } from "../auth/auth-controller.js";

dotenv.config();

// Register member
export async function registerMember(req) {
    console.log("my request create",  req.body)
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
    role_id,
  } = req.body;

  const member_code = generateMemberCode();

  try {
    // Create member in DB
    const member = await MemberRegistration.create({
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
      member_code,
    });

    // Call user registration (linked with auth)
    const response = await registerUser(req);
    console.log("User registration response:", response);

    return {
      message: "Member registered successfully",
      data: { id: member.id, member_code },
      statusCode: 201,
    };
  } catch (error) {
    console.error("Register Error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return {
        message: "Email already registered",
        data: null,
        statusCode: 409,
      };
    }

    return {
      message: error.message || "Internal server error",
      data: null,
      statusCode: 500,
    };
  }
}

// Get all members
export async function getAllMembers() {
  try {
    const members = await MemberRegistration.findAll();
    return {
      message: "Members fetched successfully",
      data: members,
      statusCode: 200,
    };
  } catch (error) {
    return {
      message: error.message || "Error fetching members",
      data: null,
      statusCode: 500,
    };
  }
}

// Get member by ID
export async function getMember(id) {
  try {
    const member = await MemberRegistration.findByPk(id);
    if (!member) {
      return {
        message: "Member not found",
        data: null,
        statusCode: 404,
      };
    }
    return {
      message: "Member fetched successfully",
      data: member,
      statusCode: 200,
    };
  } catch (error) {
    return {
      message: error.message || "Error fetching member",
      data: null,
      statusCode: 500,
    };
  }
}

// Delete member by ID
export async function deleteMember(id) {
  try {
    const member = await MemberRegistration.findByPk(id);
    if (!member) {
      return {
        message: "Member not found",
        data: null,
        statusCode: 404,
      };
    }

    await member.destroy();
    return {
      message: "Member deleted successfully",
      data: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      message: error.message || "Could not delete member",
      data: null,
      statusCode: 500,
    };
  }
}

// Update member by ID
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
      id,
    } = req.body;

    const member = await MemberRegistration.findByPk(id);
    if (!member) {
      return {
        message: "Member not found",
        data: null,
        statusCode: 404,
      };
    }

    await member.update({
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
    });

    return {
      message: "Member updated successfully",
      data: member,
      statusCode: 200,
    };
  } catch (error) {
    return {
      message: error.message || "Could not update member",
      data: null,
      statusCode: 500,
    };
  }
}

// Generate member code
function generateMemberCode() {
  const prefix = "MEB";
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNumber}`;
}
