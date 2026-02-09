import dotenv from 'dotenv';
import sequelize from './database/database.js';
import Blog from './blog/Models/Blog.js';

dotenv.config();

// Small test image (1x1 pixel red PNG in base64)
const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testBlogImage() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected');

        // Create a test blog with image
        const testBlog = await Blog.create({
            title: 'Test Blog - Image Display Check',
            category: 'Technology',
            content: 'This is a test blog post to verify image storage and retrieval.',
            image: testImageBase64,
            posted_by: 'Test User',
            isMain: 'N'
        });

        console.log('\n✓ Blog created successfully');
        console.log('Blog ID:', testBlog.id);
        console.log('Image length on creation:', testBlog.image?.length || 0);
        console.log('Image preview (first 100 chars):', testBlog.image?.substring(0, 100));

        // Retrieve the blog
        const retrievedBlog = await Blog.findByPk(testBlog.id);

        console.log('\n✓ Blog retrieved successfully');
        console.log('Retrieved Blog ID:', retrievedBlog.id);
        console.log('Retrieved image length:', retrievedBlog.image?.length || 0);
        console.log('Retrieved image preview (first 100 chars):', retrievedBlog.image?.substring(0, 100));

        // Compare
        if (testBlog.image === retrievedBlog.image) {
            console.log('\n✅ SUCCESS: Image matches perfectly!');
        } else {
            console.log('\n❌ FAILURE: Image does not match!');
            console.log('Original length:', testBlog.image?.length);
            console.log('Retrieved length:', retrievedBlog.image?.length);

            if (retrievedBlog.image && testBlog.image) {
                // Find where they differ
                for (let i = 0; i < Math.min(testBlog.image.length, retrievedBlog.image.length); i++) {
                    if (testBlog.image[i] !== retrievedBlog.image[i]) {
                        console.log(`First difference at position ${i}`);
                        console.log('Original:', testBlog.image.substring(i, i + 50));
                        console.log('Retrieved:', retrievedBlog.image.substring(i, i + 50));
                        break;
                    }
                }
            }
        }

        // Get all blogs to see how the image appears in list view
        console.log('\n--- Testing getAllBlog scenario ---');
        const allBlogs = await Blog.findAll();
        const ourBlog = allBlogs.find(b => b.id === testBlog.id);

        if (ourBlog) {
            console.log('Blog found in findAll()');
            console.log('Image length in findAll:', ourBlog.image?.length || 0);
            console.log('Image preview:', ourBlog.image?.substring(0, 100));
        }

        // Clean up - delete test blog
        await testBlog.destroy();
        console.log('\n✓ Test blog deleted');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

testBlogImage();
