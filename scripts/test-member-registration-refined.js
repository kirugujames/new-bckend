import axios from 'axios';

const testRegistration = async () => {
    const baseUrl = 'http://127.0.0.1:3000/api/members';
    const timestamp = Date.now();

    const newMemberData = {
        first_name: "Test",
        last_name: "User-" + timestamp,
        email: `testuser${timestamp}@example.com`,
        dob: "1990-01-01",
        gender: "Male",
        phone: "254700" + (timestamp % 1000000),
        idNo: "ID-" + timestamp,
        doc_type: "National ID",
        Constituency: "Westlands",
        ward: "Parklands",
        county: "Nairobi",
        area_of_interest: "Technology",
        religion: "None",
        ethnicity: "Mixed",
        membershipStatus: "new",
        verificationMethod: "email",
        username: "testuser" + timestamp,
        role_id: 2
    };

    try {
        console.log('--- Phase 1: New Member Registration ---');
        const res1 = await axios.post(`${baseUrl}/register/member`, newMemberData);
        console.log('New Member Response:', res1.data.message);
        const memberCode = res1.data.data.member_code;
        console.log('Member Code:', memberCode);

        console.log('\n--- Phase 2: Recurring/Returning Member Registration ---');
        // Using the same email/phone/id to trigger "returning" logic
        const returningMemberData = {
            ...newMemberData,
            first_name: "Updated Test",
            membershipStatus: "returning"
        };

        const res2 = await axios.post(`${baseUrl}/register/member`, returningMemberData);
        console.log('Returning Member Response:', res2.data.message);
        console.log('Status code in response:', res2.data.statusCode);

        console.log('\n--- Phase 3: Update Member ---');
        const updateData = {
            id: res1.data.data.id,
            religion: "Test Updated Religion",
            amount: 500.50
        };
        const res3 = await axios.patch(`${baseUrl}/update/member/${updateData.id}`, updateData);
        console.log('Update Member Response:', res3.data.message);
        console.log('Updated Religion:', res3.data.data.religion);
        console.log('Updated Amount:', res3.data.data.amount);

        console.log('\nVerification SUCCESS');
    } catch (error) {
        console.error('Verification FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testRegistration();
