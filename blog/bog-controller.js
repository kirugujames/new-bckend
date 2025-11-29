import Blog from "./Models/Blog.js";
import BlogCategory from "./Models/BlogCategory.js";
import Comment from "./Models/Comments.js";
import MemberRegistration from "../member-registration/models/memberRegistration.js";

// Get all blogs
export async function getAllBlog() {
  try {
    const blogs = await Blog.findAll();
    return { message: "Blogs fetched successfully", data: blogs, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Create blog
export async function createBlog(req) {
  try {
    const { title, category, content, image, isMain } = req.body;
    const posted_by = req.user?.username || "Anonymous";
    const blog = await Blog.create({ title, category, content, image, posted_by, isMain });
    return { message: "Blog created successfully", data: { id: blog.id }, statusCode: 201 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

//get main  blog
export async function getMainBlog(data) {
  console.log(data)
  try {
    const result = await Blog.findAll({ where: { isMain: data } });
    return { message: "Blog retrieved successfully", statusCode: 200, data: result }
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

//create blog category
export async function addBlogCategory(req) {
  try {
    const { category } = req.body;
    const posted_by = req.user?.username || "Anonymous";
    const blogCategory = await BlogCategory.create({ category, posted_by });
    return { message: "Blog Category created successfully", data: { id: blogCategory.id }, statusCode: 201 };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return { message: "Blog category exists", error: error.message, statusCode: 500 };
    }
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

export async function getAllBlogCategory(req) {
  try {
    const blogCategory = await BlogCategory.findAll();
    return { message: "Blog Category retrieved successfully", data: blogCategory, statusCode: 201 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}
export async function getAllBlogByCategory(req) {
  const { category } = req.query;
  try {
    const blog = await Blog.findAll({
      where: { category: category }
    });
    console.log(blog)
    return { message: "Blogs retrieved successfully", data: blog, statusCode: 201 };
  } catch (error) {
    console.log(error.message)
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}
// Get blog by ID
export async function getBlogById(id) {
  try {
    const blog = await Blog.findByPk(id, { include: Comment });
    if (!blog) return { message: "Blog not found", data: null, statusCode: 404 };
    return { message: "Blog fetched successfully", data: blog, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Update blog by ID
export async function updateBlogById(req) {
  try {
    const { title, category, content, image, id } = req.body;
    const blog = await Blog.findByPk(id);
    if (!blog) return { message: "Blog not found", data: null, statusCode: 404 };

    await blog.update({ title, category, content, image });
    return { message: "Blog updated successfully", data: null, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Delete blog by ID
export async function deleteBlogById(id) {
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) return { message: "Blog not found", data: null, statusCode: 404 };

    await blog.destroy();
    return { message: "Blog deleted successfully", data: null, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Comment on blog
export async function commentOnBlog(req) {
  const { blog_id, message, commenter_name, email } = req.body;
  try {
    const member = await MemberRegistration.findAll({ where: { email } })
    console.log(req.body)
    console.log(member);
    if (member.length === 0) {
      return { message: "member not found", statusCode: 404 };
    }

    const blog = await Blog.findByPk(blog_id);
    if (!blog) return { message: "Blog not found", data: null, statusCode: 404 };

    const comment = await Comment.create({ blog_id, message, commenter_name });
    return { message: "Comment added successfully", data: { id: comment.id }, statusCode: 201 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Delete comment by ID
export async function deleteBlog(id) {
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) return { message: "Comment not found", data: null, statusCode: 404 };

    await comment.destroy();
    return { message: "Comment deleted successfully", data: null, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Get comment by ID
export async function getCommentById(id) {
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) return { message: "Comment not found", data: null, statusCode: 404 };
    return { message: "Comment fetched successfully", data: comment, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Get comments by blog ID
export async function getCommentByBlogId(id) {
  try {
    const comments = await Comment.findAll({ where: { blog_id: id } });
    return { message: "Comments fetched successfully", data: comments, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}

// Get all comments
export async function getAllComments() {
  try {
    const comments = await Comment.findAll({ include: Blog });
    return { message: "Comments fetched successfully", data: comments, statusCode: 200 };
  } catch (error) {
    return { message: error.message, error: error.message, statusCode: 500 };
  }
}
