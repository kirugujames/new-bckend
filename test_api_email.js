import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.VERCEL_URL ? `http://${process.env.VERCEL_URL}` : 'http://localhost:3001';

async function testEmail() {
    const email = `test_debug_${Date.now()}@gmail.com`;
    console.log(`Attempting to register user with email: ${email}`);

    try {
        const response = await axios.post(`${BASE_URL}/api/users/register`, {
            email: email,
            first_name: "Debug",
            last_name: "User",
            role_id: 1, // Assuming 1 exists or is default
            password: "TestPassword123!"
        });

        console.log('✅ Registration response:', response.status);
        console.log('Response data:', response.data);
        console.log('\n👉 NOW CHECK THE SERVER TERMINAL LOGS for "📨 sendEmail called with..."');

    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else {
            console.error('❌ Request Error:', error.message);
        }
    }
}

testEmail();
