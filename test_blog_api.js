import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Small test image (1x1 pixel red PNG in base64)
const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testBlogImageAPI() {
    try {
        console.log('🧪 Testing Blog Image Storage and Retrieval\n');

        // Step 1: Create a blog with image
        console.log('📝 Step 1: Creating blog with image...');
        const createResponse = await axios.post(`${BASE_URL}/blog/add`, {
            title: 'Test Blog - Image Display Check',
            category: 'Technology',
            content: 'This is a test blog post to verify image storage and retrieval.',
            image: testImageBase64,
            isMain: 'N'
        }, {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token
                'Content-Type': 'application/json'
            }
        });

        const blogId = createResponse.data.data.id;
        console.log(`✅ Blog created with ID: ${blogId}`);
        console.log(`   Original image length: ${testImageBase64.length}\n`);

        // Step 2: Retrieve the blog by ID
        console.log('📖 Step 2: Retrieving blog by ID...');
        const getResponse = await axios.get(`${BASE_URL}/blog/get-by-id/${blogId}`);
        const retrievedBlog = getResponse.data.data;

        console.log(`✅ Blog retrieved`);
        console.log(`   Retrieved image length: ${retrievedBlog.image?.length || 0}`);
        console.log(`   Image preview: ${retrievedBlog.image?.substring(0, 100)}\n`);

        // Step 3: Compare images
        console.log('🔍 Step 3: Comparing images...');
        if (retrievedBlog.image === testImageBase64) {
            console.log('✅ SUCCESS: Images match perfectly!');
        } else {
            console.log('❌ FAILURE: Images do not match!');
            console.log(`   Expected length: ${testImageBase64.length}`);
            console.log(`   Actual length: ${retrievedBlog.image?.length || 0}`);
        }

        // Step 4: Test getAllBlog
        console.log('\n📚 Step 4: Testing getAllBlog...');
        const allBlogsResponse = await axios.get(`${BASE_URL}/blog/all`);
        const ourBlog = allBlogsResponse.data.data.find(b => b.id === blogId);

        if (ourBlog) {
            console.log(`✅ Blog found in getAllBlog`);
            console.log(`   Image length: ${ourBlog.image?.length || 0}`);
        }

        // Step 5: Clean up
        console.log('\n🧹 Step 5: Cleaning up...');
        await axios.delete(`${BASE_URL}/blog/delete/${blogId}`, {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN_HERE'
            }
        });
        console.log('✅ Test blog deleted\n');

        console.log('🎉 Test completed! Check server console for [DEBUG] logs.');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run without auth for testing (remove auth headers if not needed)
console.log('Note: Update the Authorization token if your endpoints require authentication.\n');
testBlogImageAPI();
