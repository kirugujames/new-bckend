import axios from 'axios';

const testValidation = async () => {
    const url = 'http://localhost:3000/api/events/book-event';

    console.log('--- Testing Validation ---');

    // Test 1: Missing event_id
    try {
        console.log('\nTest 1: Missing event_id');
        await axios.post(url, {
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            phone: "123456789"
        });
        console.log('Result: FAILED (Expected 400)');
    } catch (error) {
        console.log('Result: SUCCESS (Got ' + error.response?.status + ')');
        // console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }

    // Test 2: Invalid Email
    try {
        console.log('\nTest 2: Invalid email');
        await axios.post(url, {
            event_id: "2",
            first_name: "Test",
            last_name: "User",
            email: "not-an-email",
            phone: "123456789"
        });
        console.log('Result: FAILED (Expected 400)');
    } catch (error) {
        console.log('Result: SUCCESS (Got ' + error.response?.status + ')');
        // console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }

    // Test 3: Event Not Found (assuming ID 99999 doesn't exist)
    try {
        console.log('\nTest 3: Event Not Found (ID 99999)');
        await axios.post(url, {
            event_id: "99999",
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            phone: "123456789"
        });
        console.log('Result: FAILED (Expected 404)');
    } catch (error) {
        console.log('Result: SUCCESS (Got ' + error.response?.status + ')');
        // console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    }
};

testValidation();
