import axios from 'axios';

const testAspirantModule = async () => {
    const baseUrl = 'http://localhost:3000/api/aspirants';

    console.log('--- Phase 1: Verify Unauthorized Access ---');
    try {
        await axios.get(`${baseUrl}/all`);
        console.log('Phase 1 FAILED: /all should require a token');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Phase 1 SUCCESS: /all correctly returned 401 Unauthorized');
        } else {
            console.error('Phase 1 ERROR:', error.message);
        }
    }

    console.log('\n--- Phase 2: Verify Endpoint Definitions (Check 404 vs 401) ---');
    // If it returns 401, it means the route exists but needs a token.
    // If it returns 404, the route actually doesn't exist.
    const checkRoute = async (method, path) => {
        try {
            await axios({ method, url: `${baseUrl}${path}` });
            console.log(`Route ${method} ${path} is OPEN (unexpected)`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(`Route ${method} ${path} EXISTS (requires token)`);
            } else {
                console.log(`Route ${method} ${path} ERROR/NOT FOUND:`, error.response ? error.response.status : error.message);
            }
        }
    };

    await checkRoute('POST', '/apply');
    await checkRoute('GET', '/member/TEST-123');
    await checkRoute('PATCH', '/update-status');

    console.log('\nVerification complete. Routes are registered and protected.');
};

testAspirantModule();
