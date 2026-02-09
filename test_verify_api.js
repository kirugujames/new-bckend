import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/members';

async function runTests() {
    console.log('--- Starting Existence Verification Test ---');
    try {
        // 1. Register a test member
        const idNo = `${Math.floor(Math.random() * 1000000000)}`;
        const phone = `254${Math.floor(Math.random() * 1000000000)}`;
        const email = `test_verify_${Date.now()}@gmail.com`;

        console.log(`\n1. Registering member with idNo: ${idNo}, phone: ${phone}`);
        const regRes = await axios.post(`${BASE_URL}/register/member`, {
            "first_name": "Verify",
            "last_name": "Test",
            "email": email,
            "dob": "1990-01-01",
            "gender": "Male",
            "phone": phone,
            "idNo": idNo,
            "doc_type": "National ID",
            "Constituency": "Shinyalu",
            "ward": "Chekalini",
            "county": "Kakamega",
            "membershipStatus": "new",
            "politicalDeclaration": true,
            "termsConsent": true,
            "verificationMethod": "email",
            "membershipType": "Free",
            "specialInterest": ["Test"],
            "amount": 0
        });
        console.log('Registration Success');

        // 2. Verify existence (Success case)
        console.log('\n2. Testing verify/existence (Success case)');
        const verifyRes = await axios.post(`${BASE_URL}/verify/existence`, {
            idNo: idNo,
            phone: phone,
            hasConsent: true
        });
        console.log('Verification Response:', verifyRes.data);

        // 3. Verify existence (Fail case - mismatched data)
        console.log('\n3. Testing verify/existence (Fail case - wrong phone)');
        try {
            await axios.post(`${BASE_URL}/verify/existence`, {
                idNo: idNo,
                phone: '254000000000',
                hasConsent: true
            });
        } catch (error) {
            console.log('Verification Error (Expected):', error.response ? error.response.data : error.message);
        }

        // 4. Verify existence (Fail case - no consent)
        console.log('\n4. Testing verify/existence (Fail case - no consent)');
        try {
            await axios.post(`${BASE_URL}/verify/existence`, {
                idNo: idNo,
                phone: phone,
                hasConsent: false
            });
        } catch (error) {
            console.log('Verification Error (Expected):', error.response ? error.response.data : error.message);
        }

    } catch (error) {
        console.log('Test Error:', error.response ? error.response.data : error.message);
    }
}

runTests();
