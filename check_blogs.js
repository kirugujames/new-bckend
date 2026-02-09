import sequelize from './database/database.js';
import Blog from './blog/Models/Blog.js';

async function checkBlogs() {
    try {
        await sequelize.authenticate();
        const blogs = await Blog.findAll({ limit: 5 });
        console.log('--- Current Blogs ---');
        blogs.forEach(blog => {
            console.log(`ID: ${blog.id}, Title: ${blog.title}, Image: ${blog.image}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkBlogs();
