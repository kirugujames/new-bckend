import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/blog';

// Large base64 string to simulate an image
const largeBase64 = 'data:image/jpeg;base64,' + 'a'.repeat(50000);

async function testBase64Blog() {
    console.log('--- Testing Base64 Blog Image ---');
    try {
        // 1. Authenticate (assuming we need a token for creation)
        // For this test, let's assume one of the routes might be public or we use a known test token if available.
        // If createBlog requires token, we might need a login step, but let's try a public one first if any exists or assume bypass for local test.

        console.log('\n1. Creating blog with large Base64 image...');
        // Note: The /add route uses verifyToken
        // We'll need a valid token. Let's look for a way to get one or skip if possible.
        // Actually, let's just test if we can fetch existing ones and see if they handle large data if we add it manually or via a public update if any.

        // Let's assume the user can provide a token if needed, but for automated test, I'll try to find an existing user or create one.

    } catch (error) {
        console.error('Test Error:', error.response ? error.response.data : error.message);
    }
}

testBase64Blog();
